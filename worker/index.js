/* Sula Products — the small server behind the shop's admin page (/admin).
   Everything else on the site is plain files; this only answers /api/... links.

   It needs two secrets, added in Cloudflare (Workers > sula-products > Settings >
   Variables and Secrets), never written in this file:
     ADMIN_PASSWORD  the password the shop owner types on /admin
     GITHUB_TOKEN    a GitHub token that may change this repository's files
   When the owner presses Save, this saves data/products.json, data/settings.json
   and any new photos into the repository; Cloudflare then republishes the site. */

const API = "https://api.github.com";
const SESSION_DAYS = 30;
const PRODUCTS_PATH = "data/products.json";
const SETTINGS_PATH = "data/settings.json";
const MAX_PHOTO_BYTES = 3 * 1024 * 1024;

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname.startsWith("/api/")) {
      try {
        return await handleApi(request, env, url);
      } catch (err) {
        if (err instanceof HttpError) return json({ error: err.code }, err.status);
        console.error(err && err.stack || err);
        return json({ error: "server" }, 500);
      }
    }
    return env.ASSETS.fetch(request);
  }
};

class HttpError extends Error {
  constructor(status, code) { super(code); this.status = status; this.code = code; }
}

function json(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store", "X-Robots-Tag": "noindex" }
  });
}

async function handleApi(request, env, url) {
  if (!env.ADMIN_PASSWORD || !env.GITHUB_TOKEN) throw new HttpError(503, "not_configured");
  const route = request.method + " " + url.pathname;

  if (route === "POST /api/login") {
    const body = await readJson(request, 10_000);
    const ok = typeof body.password === "string" && await sameText(body.password, env.ADMIN_PASSWORD);
    if (!ok) {
      await new Promise((r) => setTimeout(r, 1200)); // slows down password guessing
      throw new HttpError(401, "wrong_password");
    }
    return json({ token: await makeToken(env), days: SESSION_DAYS });
  }

  await requireLogin(request, env);

  if (route === "GET /api/session") return json({ ok: true });

  if (route === "GET /api/data") {
    const gh = github(env);
    const [products, settings] = await Promise.all([gh.readFile(PRODUCTS_PATH), gh.readFile(SETTINGS_PATH)]);
    return json({
      products: JSON.parse(products.text),
      settings: JSON.parse(settings.text),
      productsSha: products.sha,
      settingsSha: settings.sha
    });
  }

  if (route === "POST /api/save") {
    const body = await readJson(request, 60 * 1024 * 1024);
    return json(await save(env, body));
  }

  throw new HttpError(404, "not_found");
}

async function readJson(request, limit) {
  const text = await request.text();
  if (text.length > limit) throw new HttpError(413, "too_large");
  try { return JSON.parse(text) || {}; } catch (e) { throw new HttpError(400, "bad_request"); }
}

/* ---------- Login ---------- */

const enc = new TextEncoder();

async function hmacKey(env) {
  return crypto.subtle.importKey("raw", enc.encode("sula-admin-session:" + env.ADMIN_PASSWORD),
    { name: "HMAC", hash: "SHA-256" }, false, ["sign", "verify"]);
}

function b64url(bytes) {
  let s = "";
  new Uint8Array(bytes).forEach((b) => { s += String.fromCharCode(b); });
  return btoa(s).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

async function sameText(a, b) {
  // Compare hashes so the time taken does not reveal how much of the password was right
  const [x, y] = await Promise.all([crypto.subtle.digest("SHA-256", enc.encode(a)), crypto.subtle.digest("SHA-256", enc.encode(b))]);
  const ax = new Uint8Array(x), by = new Uint8Array(y);
  let diff = 0;
  for (let i = 0; i < ax.length; i++) diff |= ax[i] ^ by[i];
  return diff === 0;
}

// Changing ADMIN_PASSWORD signs everyone out, because the password is part of the key
async function makeToken(env) {
  const payload = b64url(enc.encode(JSON.stringify({ exp: Date.now() + SESSION_DAYS * 86400000 })));
  const sig = await crypto.subtle.sign("HMAC", await hmacKey(env), enc.encode(payload));
  return payload + "." + b64url(sig);
}

async function requireLogin(request, env) {
  const auth = request.headers.get("Authorization") || "";
  const token = auth.startsWith("Bearer ") ? auth.slice(7) : "";
  const [payload, sig] = token.split(".");
  if (!payload || !sig) throw new HttpError(401, "signed_out");
  const expected = await crypto.subtle.sign("HMAC", await hmacKey(env), enc.encode(payload));
  if (!(await sameText(b64url(expected), sig))) throw new HttpError(401, "signed_out");
  let data;
  try { data = JSON.parse(atob(payload.replace(/-/g, "+").replace(/_/g, "/"))); } catch (e) { throw new HttpError(401, "signed_out"); }
  if (!data || typeof data.exp !== "number" || data.exp < Date.now()) throw new HttpError(401, "signed_out");
}

/* ---------- GitHub ---------- */

function github(env) {
  const repo = env.GITHUB_REPO;
  const branch = env.GITHUB_BRANCH || "main";
  const base = (env.GITHUB_API || API) + "/repos/" + repo;

  async function call(method, path, body) {
    const res = await fetch(base + path, {
      method,
      headers: {
        "Authorization": "Bearer " + env.GITHUB_TOKEN,
        "Accept": "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28",
        "User-Agent": "sula-products-admin",
        ...(body ? { "Content-Type": "application/json" } : {})
      },
      body: body ? JSON.stringify(body) : undefined
    });
    if (!res.ok) {
      const text = await res.text().catch(() => "");
      console.error("GitHub " + method + " " + path + " -> " + res.status + " " + text.slice(0, 300));
      if (res.status === 401 || res.status === 403) throw new HttpError(502, "store_key_rejected");
      if (res.status === 409 || res.status === 422) throw new HttpError(409, "changed_elsewhere");
      throw new HttpError(502, "store_unreachable");
    }
    return res.json();
  }

  return {
    async readFile(path) {
      const meta = await call("GET", "/contents/" + path + "?ref=" + encodeURIComponent(branch));
      const bin = atob(String(meta.content || "").replace(/\n/g, ""));
      const bytes = Uint8Array.from(bin, (c) => c.charCodeAt(0));
      return { sha: meta.sha, text: new TextDecoder().decode(bytes) };
    },

    // One commit containing every changed file, so the site republishes once
    async commit(message, files) {
      const ref = await call("GET", "/git/ref/heads/" + branch);
      const head = ref.object.sha;
      const headCommit = await call("GET", "/git/commits/" + head);
      const tree = [];
      for (const f of files) {
        const blob = await call("POST", "/git/blobs", f.base64 ? { content: f.base64, encoding: "base64" } : { content: f.text, encoding: "utf-8" });
        tree.push({ path: f.path, mode: "100644", type: "blob", sha: blob.sha });
      }
      const newTree = await call("POST", "/git/trees", { base_tree: headCommit.tree.sha, tree });
      const commit = await call("POST", "/git/commits", {
        message,
        tree: newTree.sha,
        parents: [head],
        author: { name: "Sula admin", email: "admin@sula-products.invalid" }
      });
      await call("PATCH", "/git/refs/heads/" + branch, { sha: commit.sha, force: false });
      return commit.sha;
    }
  };
}

/* ---------- Saving ---------- */

async function save(env, body) {
  const gh = github(env);
  const files = [];
  const result = { ok: true };

  // Refuse to overwrite changes made somewhere else since the admin page loaded them
  const [curProducts, curSettings] = await Promise.all([
    body.products ? gh.readFile(PRODUCTS_PATH) : null,
    body.settings ? gh.readFile(SETTINGS_PATH) : null
  ]);
  if (curProducts && curProducts.sha !== body.productsSha) throw new HttpError(409, "changed_elsewhere");
  if (curSettings && curSettings.sha !== body.settingsSha) throw new HttpError(409, "changed_elsewhere");

  const uploads = Array.isArray(body.uploads) ? body.uploads : [];
  if (uploads.length > 40) throw new HttpError(413, "too_large");
  for (const u of uploads) {
    if (!u || typeof u.path !== "string" || !/^images\/products\/[a-z0-9][a-z0-9-]{0,80}\.(jpg|png|webp)$/.test(u.path)) throw new HttpError(400, "bad_photo");
    if (typeof u.base64 !== "string" || !/^[A-Za-z0-9+/=]+$/.test(u.base64) || u.base64.length * 0.75 > MAX_PHOTO_BYTES) throw new HttpError(400, "bad_photo");
    files.push({ path: u.path, base64: u.base64 });
  }

  if (body.products) {
    const text = formatProducts(cleanCatalog(body.products));
    if (text !== curProducts.text) files.push({ path: PRODUCTS_PATH, text });
    result.productsText = text;
    result.productsSha = await blobSha(text);
  }
  if (body.settings) {
    const text = formatSettings(cleanSettings(body.settings));
    if (text !== curSettings.text) files.push({ path: SETTINGS_PATH, text });
    result.settingsText = text;
    result.settingsSha = await blobSha(text);
  }

  if (!files.length) { result.unchanged = true; return result; }
  const what = [body.products && "products", body.settings && "settings", uploads.length && uploads.length + " photo(s)"].filter(Boolean).join(", ");
  result.commit = await gh.commit("Shop admin: update " + what, files);
  return result;
}

// The id GitHub gives a file's content, so the page can save again without reloading
async function blobSha(text) {
  const body = enc.encode(text);
  const head = enc.encode("blob " + body.length + "\0");
  const all = new Uint8Array(head.length + body.length);
  all.set(head); all.set(body, head.length);
  const hash = new Uint8Array(await crypto.subtle.digest("SHA-1", all));
  return Array.from(hash, (b) => b.toString(16).padStart(2, "0")).join("");
}

/* ---------- Checking what the admin page sends ---------- */

const ID = /^[a-z0-9][a-z0-9-]{0,80}$/;
const IMAGE_SRC = /^images\/[a-z0-9][a-z0-9/_.-]{0,150}\.(jpg|jpeg|png|webp|svg)$/;
const COLOR = /^#[0-9a-fA-F]{6}$/;

function bad(what) { throw new HttpError(400, "bad_" + what); }

function text(v, max, required) {
  if (v === undefined || v === null || v === "") { if (required) bad("text"); return undefined; }
  if (typeof v !== "string") bad("text");
  const s = v.replace(/\r\n?/g, "\n").trim();
  if (s.length > max) bad("text");
  if (!s && required) bad("text");
  return s || undefined;
}

function price(v) {
  if (v === null || v === undefined || v === "") return null;
  const n = typeof v === "string" ? Number(v) : v;
  if (typeof n !== "number" || !isFinite(n) || n < 0 || n > 100000) bad("price");
  return Math.round(n * 1000) / 1000;
}

// Keeps the key order the file already uses, drops empty optional fields
function put(target, key, value) { if (value !== undefined) target[key] = value; }

function cleanCatalog(raw) {
  if (!raw || !Array.isArray(raw.categories) || !Array.isArray(raw.products)) bad("catalog");
  const catIds = new Set();
  const categories = raw.categories.map((c) => {
    const id = text(c && c.id, 80, true);
    if (!ID.test(id) || catIds.has(id)) bad("category");
    catIds.add(id);
    const out = { id };
    put(out, "name", text(c.name, 80, true));
    put(out, "name_en", text(c.name_en, 80));
    return out;
  });

  const productIds = new Set();
  const variantIds = new Set();
  const products = raw.products.map((p) => {
    if (!p || typeof p !== "object") bad("product");
    const out = {};
    for (const key of Object.keys(p)) {
      switch (key) {
        case "id": {
          const id = text(p.id, 80, true);
          if (!ID.test(id) || productIds.has(id)) bad("product");
          productIds.add(id); out.id = id; break;
        }
        case "name": put(out, key, text(p[key], 200, true)); break;
        case "name_en": case "optionLabel": case "optionLabel_en": put(out, key, text(p[key], 200)); break;
        case "description": case "description_en": put(out, key, text(p[key], 3000)); break;
        case "category": {
          const c = text(p.category, 80, true);
          if (!catIds.has(c)) bad("category");
          out.category = c; break;
        }
        case "featured": case "sample": out[key] = p[key] === true; break;
        case "status": if (p.status === "draft") out.status = "draft"; break;
        case "images": {
          if (!Array.isArray(p.images) || p.images.length > 20) bad("photo");
          out.images = p.images.map((img) => {
            const src = text(img && img.src, 200, true);
            if (!IMAGE_SRC.test(src) || src.includes("..")) bad("photo");
            const o = { src };
            put(o, "alt", text(img.alt, 300));
            put(o, "alt_en", text(img.alt_en, 300));
            return o;
          });
          break;
        }
        case "variants": {
          if (!Array.isArray(p.variants) || !p.variants.length || p.variants.length > 80) bad("variant");
          out.variants = p.variants.map((v) => {
            if (!v || typeof v !== "object") bad("variant");
            const o = {};
            for (const vk of Object.keys(v)) {
              switch (vk) {
                case "id": {
                  const id = text(v.id, 120, true);
                  if (!/^[a-z0-9][a-z0-9-]{0,120}$/.test(id) || variantIds.has(id)) bad("variant");
                  variantIds.add(id); o.id = id; break;
                }
                case "shade": case "shade_en": put(o, vk, text(v[vk], 200)); break;
                case "swatch": if (v.swatch) { if (!COLOR.test(v.swatch)) bad("variant"); o.swatch = v.swatch.toUpperCase(); } break;
                case "swatchImage": case "image": if (v[vk]) { const s = text(v[vk], 200); if (!IMAGE_SRC.test(s) || s.includes("..")) bad("photo"); o[vk] = s; } break;
                case "price": o.price = price(v.price); break;
                case "available": o.available = v.available === true; break;
                default: break; // unknown fields are dropped
              }
            }
            if (!o.id) bad("variant");
            if (!("price" in o)) o.price = null;
            if (!("available" in o)) o.available = true;
            return o;
          });
          break;
        }
        default: break;
      }
    }
    if (!out.id || !out.name || !out.category || !out.variants) bad("product");
    if (!out.images) out.images = [];
    return out;
  });
  return { categories, products };
}

function cleanSettings(raw) {
  if (!raw || typeof raw !== "object") bad("settings");
  const out = JSON.parse(JSON.stringify(raw)); // keeps fields the admin page does not edit
  const digits = String(out.whatsappNumber || "").replace(/\D/g, "");
  if (!/^\d{8,15}$/.test(digits)) bad("whatsapp");
  out.whatsappNumber = digits;
  ["intro", "intro_en", "brandTagline", "brandTagline_en", "instagramHandle"].forEach((k) => {
    if (k in out) out[k] = text(out[k], 2000) || "";
  });
  if (out.instagramUrl && !/^https:\/\/(www\.)?instagram\.com\/[A-Za-z0-9._\/-]*$/.test(out.instagramUrl)) bad("instagram");
  if (out.delivery) {
    if (out.delivery.deliveryFeeOMR !== undefined) out.delivery.deliveryFeeOMR = price(out.delivery.deliveryFeeOMR);
    ["deliveryNote", "pickupNote", "deliveryNote_en", "pickupNote_en"].forEach((k) => {
      if (k in out.delivery) out.delivery[k] = text(out.delivery[k], 1000) || "";
    });
    ["deliveryEnabled", "pickupEnabled"].forEach((k) => { if (k in out.delivery) out.delivery[k] = out.delivery[k] === true; });
    if (!out.delivery.deliveryEnabled && !out.delivery.pickupEnabled) bad("delivery");
  }
  if (out.maxQuantityPerItem !== undefined) {
    const n = Number(out.maxQuantityPerItem);
    if (!Number.isInteger(n) || n < 1 || n > 99) bad("settings");
    out.maxQuantityPerItem = n;
  }
  return out;
}

/* ---------- Writing the files in the same layout as before ----------
   products.json keeps each photo and each shade on one line, and prices
   always have three decimals (3.500), so the file stays easy to read. */

function value(v, key) {
  if (key === "price" || key === "deliveryFeeOMR") return v === null ? "null" : Number(v).toFixed(3);
  return JSON.stringify(v);
}

function oneLine(obj, spaced) {
  const inner = Object.keys(obj).map((k) => JSON.stringify(k) + ": " + value(obj[k], k)).join(", ");
  return spaced ? "{ " + inner + " }" : "{" + inner + "}";
}

function formatProducts(data) {
  const lines = ["{", '  "categories": ['];
  data.categories.forEach((c, i) => lines.push("    " + oneLine(c, true) + (i < data.categories.length - 1 ? "," : "")));
  lines.push("  ],", '  "products": [');
  data.products.forEach((p, pi) => {
    lines.push("    {");
    const keys = Object.keys(p);
    keys.forEach((k, ki) => {
      const comma = ki < keys.length - 1 ? "," : "";
      if (k === "images" || k === "variants") {
        if (!p[k].length) { lines.push("      " + JSON.stringify(k) + ": []" + comma); return; }
        lines.push("      " + JSON.stringify(k) + ": [");
        p[k].forEach((item, ii) => lines.push("        " + oneLine(item, false) + (ii < p[k].length - 1 ? "," : "")));
        lines.push("      ]" + comma);
      } else {
        lines.push("      " + JSON.stringify(k) + ": " + value(p[k], k) + comma);
      }
    });
    lines.push("    }" + (pi < data.products.length - 1 ? "," : ""));
  });
  lines.push("  ]", "}");
  return lines.join("\n") + "\n";
}

function formatSettings(data) {
  return JSON.stringify(data, null, 2)
    .replace(/("deliveryFeeOMR": )(\d+(\.\d+)?)/, (m, a, n) => a + Number(n).toFixed(3)) + "\n";
}

// Exposed for the tests in worker/test.mjs
export const _test = { formatProducts, formatSettings, cleanCatalog, cleanSettings };
