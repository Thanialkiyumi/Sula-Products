/* =========================================================
   Sula Products — shared code used by every page.
   You normally do NOT need to edit this file.
   Products live in data/products.json
   Store settings live in data/settings.json
   ========================================================= */
(function () {
  "use strict";

  var CART_KEY = "sula-cart-v1";
  var I = window.I18n;   // translations, from i18n.js
  var t = I.t;
  var FALLBACK_IMAGE = "images/site/no-image.svg";

  /* ---------- Small DOM helper ----------
     Builds elements with textContent only, so text from the JSON
     files is never interpreted as HTML. */
  function el(tag, attrs, children) {
    var node = document.createElement(tag);
    if (attrs) {
      Object.keys(attrs).forEach(function (key) {
        var value = attrs[key];
        if (value === null || value === undefined || value === false) return;
        if (key === "text") node.textContent = value;
        else if (key === "className") node.className = value;
        else if (key.indexOf("on") === 0 && typeof value === "function") node.addEventListener(key.slice(2), value);
        else if (key === "style" && typeof value === "object") Object.keys(value).forEach(function (prop) { node.style.setProperty(prop, value[prop]); });
        else node.setAttribute(key, value === true ? "" : String(value));
      });
    }
    (children || []).forEach(function (child) {
      if (child === null || child === undefined || child === false) return;
      node.appendChild(typeof child === "string" ? document.createTextNode(child) : child);
    });
    return node;
  }

  /* ---------- Money (integer baisa: 1 OMR = 1000 baisa) ---------- */

  // Converts 3.5, "3.500" or "3" into 3500 baisa without floating-point errors.
  // Returns null for anything that is not a valid price.
  function toBaisa(value) {
    if (typeof value === "number") {
      if (!isFinite(value) || value < 0) return null;
      value = value.toFixed(3);
    }
    if (typeof value !== "string") return null;
    var match = value.trim().match(/^(\d+)(?:\.(\d{1,3}))?$/);
    if (!match) return null;
    var whole = parseInt(match[1], 10);
    var fraction = parseInt(((match[2] || "") + "000").slice(0, 3), 10);
    return whole * 1000 + fraction;
  }

  var currencyLabel = "ر.ع.";

  // 3500 -> "3.500 ر.ع." (or "3.500 OMR" in English)
  function formatBaisa(baisa) {
    var whole = Math.floor(baisa / 1000);
    var fraction = String(baisa % 1000);
    while (fraction.length < 3) fraction = "0" + fraction;
    return whole + "." + fraction + " " + currencyLabel;
  }

  function priceEl(baisa, tag) {
    return el(tag || "span", { className: "price", text: formatBaisa(baisa) });
  }

  /* ---------- Safety checks for values coming from JSON ---------- */

  function safeImageSrc(src) {
    if (typeof src !== "string") return FALLBACK_IMAGE;
    src = src.trim();
    if (/^https:\/\/[^\s"'<>]+$/i.test(src)) return src;
    if (/^[A-Za-z0-9_\-./]+$/.test(src) && src.indexOf("..") === -1 && src.charAt(0) !== "/") return src;
    return FALLBACK_IMAGE;
  }

  function safeColor(value) {
    return typeof value === "string" && /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(value.trim()) ? value.trim() : null;
  }

  function cleanText(value) {
    return typeof value === "string" ? value.trim() : "";
  }

  /* ---------- Load and check the data files ---------- */

  function fetchJSON(path) {
    return fetch(path, { cache: "no-cache" }).then(function (response) {
      if (!response.ok) throw new Error(path + " returned " + response.status);
      return response.json();
    });
  }

  function normalizeCatalog(raw) {
    var categories = [];
    var categoryNames = {};
    (Array.isArray(raw && raw.categories) ? raw.categories : []).forEach(function (c) {
      var id = cleanText(c && c.id);
      if (!id || categoryNames[id]) return;
      categoryNames[id] = cleanText(I.pick(c, "name")) || id;
      categories.push({ id: id, name: categoryNames[id] });
    });

    var products = [];
    var seenProducts = {};
    var seenVariants = {};

    (Array.isArray(raw && raw.products) ? raw.products : []).forEach(function (p, index) {
      var id = cleanText(p && p.id);
      if (!id) { console.warn("products.json: product #" + (index + 1) + " has no id and was skipped."); return; }
      if (seenProducts[id]) { console.warn("products.json: duplicate product id \"" + id + "\" was skipped."); return; }

      var variants = [];
      (Array.isArray(p.variants) ? p.variants : []).forEach(function (v, vIndex) {
        var vid = cleanText(v && v.id);
        if (!vid) { console.warn("products.json: variant #" + (vIndex + 1) + " of \"" + id + "\" has no id and was skipped."); return; }
        if (seenVariants[vid]) { console.warn("products.json: duplicate variant id \"" + vid + "\" was skipped."); return; }
        var priceBaisa = toBaisa(v.price);
        if (priceBaisa === null) console.warn("products.json: variant \"" + vid + "\" has an invalid price, so it is shown as unavailable.");
        seenVariants[vid] = true;
        variants.push({
          id: vid,
          shade: cleanText(I.pick(v, "shade")) || null,
          searchText: [v.id, v.shade, v.shade_en].join(" "),
          swatch: safeColor(v.swatch),
          priceBaisa: priceBaisa,
          available: v.available === true && priceBaisa !== null
        });
      });
      if (!variants.length) { console.warn("products.json: product \"" + id + "\" has no variants and was skipped."); return; }

      var images = (Array.isArray(p.images) ? p.images : []).map(function (img) {
        return { src: safeImageSrc(img && img.src), alt: cleanText(I.pick(img, "alt")) };
      });
      if (!images.length) images.push({ src: FALLBACK_IMAGE, alt: "" });

      seenProducts[id] = true;
      products.push({
        id: id,
        name: cleanText(I.pick(p, "name")) || id,
        category: cleanText(p.category),
        categoryName: categoryNames[cleanText(p.category)] || "",
        description: cleanText(I.pick(p, "description")),
        featured: p.featured === true,
        sample: p.sample === true,
        optionLabel: cleanText(I.pick(p, "optionLabel")) || t("product.optionDefault"),
        // Search works in both languages, whatever language the page is in
        searchText: [id, p.name, p.name_en, p.description, p.description_en].concat(variants.map(function (v) { return v.searchText; })).join(" "),
        images: images,
        variants: variants,
        hasOptions: variants.length > 1 || variants.some(function (v) { return v.shade; })
      });
    });

    var byProduct = {};
    var byVariant = {};
    products.forEach(function (p) {
      byProduct[p.id] = p;
      p.variants.forEach(function (v) { byVariant[v.id] = { product: p, variant: v }; });
    });

    return { categories: categories, products: products, byProduct: byProduct, byVariant: byVariant };
  }

  function normalizeSettings(raw) {
    raw = raw || {};
    var delivery = raw.delivery || {};
    var feeBaisa = delivery.deliveryFeeOMR === null || delivery.deliveryFeeOMR === undefined ? null : toBaisa(delivery.deliveryFeeOMR);
    var max = parseInt(raw.maxQuantityPerItem, 10);
    return {
      brandName: cleanText(raw.brandName) || "Sula Products",
      brandTagline: cleanText(I.pick(raw, "brandTagline")),
      intro: cleanText(I.pick(raw, "intro")),
      instagramUrl: /^https:\/\/(www\.)?instagram\.com\/[A-Za-z0-9_.\/-]*$/.test(cleanText(raw.instagramUrl)) ? cleanText(raw.instagramUrl) : "",
      instagramHandle: cleanText(raw.instagramHandle),
      whatsapp: checkWhatsAppNumber(raw.whatsappNumber),
      currencyLabel: cleanText(I.pick(raw, "currencyLabel")) || "ر.ع.",
      maxQty: max >= 1 && max <= 99 ? max : 10,
      deliveryEnabled: delivery.deliveryEnabled !== false,
      pickupEnabled: delivery.pickupEnabled !== false,
      deliveryFeeBaisa: feeBaisa,
      deliveryNote: cleanText(I.pick(delivery, "deliveryNote")),
      pickupNote: cleanText(I.pick(delivery, "pickupNote")),
      areas: (Array.isArray(raw.areas) ? raw.areas : []).map(cleanText).filter(Boolean),
      heroImage: raw.heroImage ? { src: safeImageSrc(raw.heroImage.src), alt: cleanText(I.pick(raw.heroImage, "alt")) } : null
    };
  }

  // The store number must include the country code, digits only, e.g. 96890000000
  function checkWhatsAppNumber(value) {
    var digits = String(value || "").replace(/[\s+\-()]/g, "");
    if (!digits) return { ok: false, number: "", problem: "missing" };
    if (!/^\d+$/.test(digits) || /^0+$/.test(digits)) return { ok: false, number: "", problem: "invalid" };
    if (digits.indexOf("968") === 0 ? digits.length !== 11 : (digits.length < 10 || digits.length > 15)) {
      return { ok: false, number: "", problem: "invalid" };
    }
    return { ok: true, number: digits, problem: null };
  }

  /* ---------- Cart (saved in this browser with localStorage) ---------- */

  function storageGet(key) {
    try { return window.localStorage.getItem(key); } catch (e) { return null; }
  }
  function storageSet(key, value) {
    try { window.localStorage.setItem(key, value); return true; } catch (e) { return false; }
  }

  function readCart() {
    var parsed;
    try { parsed = JSON.parse(storageGet(CART_KEY) || "[]"); } catch (e) { parsed = []; }
    return Array.isArray(parsed) ? parsed : [];
  }

  function writeCart(items) {
    storageSet(CART_KEY, JSON.stringify(items.map(function (i) {
      return { productId: i.productId, variantId: i.variantId, qty: i.qty, priceBaisa: i.priceBaisa, name: i.name, shade: i.shade };
    })));
    updateCartCount(items);
  }

  function itemLabel(name, shade) {
    return shade ? name + " – " + shade : name;
  }

  // Checks the saved cart against the latest products.json.
  // Returns the cleaned cart plus messages that explain any change.
  function validateCart(catalog, settings) {
    var saved = readCart();
    var notices = [];
    var merged = {};
    var order = [];
    var changed = false;

    saved.forEach(function (raw) {
      if (!raw || typeof raw !== "object") { changed = true; return; }
      var oldName = cleanText(raw.name) || t("notice.unknownItem");
      var oldShade = cleanText(raw.shade) || null;
      var found = catalog.byVariant[cleanText(raw.variantId)];

      if (!found || found.product.id !== raw.productId) {
        notices.push(t("notice.gone", { item: itemLabel(oldName, oldShade) }));
        changed = true;
        return;
      }
      var p = found.product, v = found.variant;
      if (!v.available) {
        notices.push(t("notice.unavailable", { item: itemLabel(p.name, v.shade) }));
        changed = true;
        return;
      }

      var qty = parseInt(raw.qty, 10);
      if (!(qty >= 1)) { qty = 1; changed = true; }

      var oldPrice = typeof raw.priceBaisa === "number" ? raw.priceBaisa : null;
      if (oldPrice !== null && oldPrice !== v.priceBaisa) {
        notices.push(t("notice.price", { item: itemLabel(p.name, v.shade), old: formatBaisa(oldPrice), new: formatBaisa(v.priceBaisa) }));
        changed = true;
      }
      if (oldName !== p.name || oldShade !== v.shade || oldPrice === null) changed = true;

      if (merged[v.id]) {
        merged[v.id].qty += qty;
        changed = true;
      } else {
        merged[v.id] = { productId: p.id, variantId: v.id, qty: qty, priceBaisa: v.priceBaisa, name: p.name, shade: v.shade };
        order.push(v.id);
      }
    });

    var items = order.map(function (id) {
      var item = merged[id];
      if (item.qty > settings.maxQty) {
        notices.push(t("notice.max", { item: itemLabel(item.name, item.shade), max: settings.maxQty }));
        item.qty = settings.maxQty;
        changed = true;
      }
      return item;
    });

    if (changed) writeCart(items);
    return { items: items, notices: notices };
  }

  function addToCart(cart, product, variant, qty, settings) {
    var existing = cart.find(function (i) { return i.variantId === variant.id; });
    var capped = false;
    if (existing) {
      existing.qty += qty;
      if (existing.qty > settings.maxQty) { existing.qty = settings.maxQty; capped = true; }
    } else {
      if (qty > settings.maxQty) { qty = settings.maxQty; capped = true; }
      cart.push({ productId: product.id, variantId: variant.id, qty: qty, priceBaisa: variant.priceBaisa, name: product.name, shade: variant.shade });
    }
    writeCart(cart);
    return { capped: capped };
  }

  function cartLines(cart, catalog) {
    return cart.map(function (item) {
      var found = catalog.byVariant[item.variantId];
      return {
        item: item,
        product: found.product,
        variant: found.variant,
        lineBaisa: found.variant.priceBaisa * item.qty
      };
    });
  }

  function subtotalBaisa(lines) {
    return lines.reduce(function (sum, line) { return sum + line.lineBaisa; }, 0);
  }

  var lastCount = null;
  function updateCartCount(items) {
    var count = (items || readCart()).reduce(function (sum, i) { return sum + (parseInt(i.qty, 10) || 0); }, 0);
    document.querySelectorAll("[data-cart-count]").forEach(function (node) {
      node.textContent = String(count);
      // Small bounce on the cart badge when the number changes
      var badge = node.closest(".cart-count");
      if (badge && lastCount !== null && count !== lastCount) {
        badge.classList.remove("bump");
        void badge.offsetWidth; // restart the animation
        badge.classList.add("bump");
      }
    });
    lastCount = count;
  }

  /* ---------- Toast: a short message that slides up from the bottom ---------- */
  var toastNode = null, toastTimer = null;
  function toast(message, link) {
    if (!toastNode) {
      toastNode = el("div", { className: "toast", role: "status", "aria-live": "polite" });
      document.body.appendChild(toastNode);
    }
    toastNode.textContent = "";
    toastNode.appendChild(el("span", { text: message }));
    if (link) toastNode.appendChild(el("a", { href: link.href, text: link.text }));
    requestAnimationFrame(function () { toastNode.classList.add("is-visible"); });
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toastNode.classList.remove("is-visible"); }, 4000);
  }

  /* ---------- Header shadow once the page is scrolled ---------- */
  function watchHeader() {
    var header = document.querySelector(".site-header");
    if (!header) return;
    var onScroll = function () { header.classList.toggle("is-scrolled", window.scrollY > 8); };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  /* ---------- Arabic-friendly search ---------- */
  function normalizeSearch(text) {
    return String(text || "")
      .toLowerCase()
      .replace(/[ً-ْـ]/g, "")   // remove harakat and tatweel
      .replace(/[أإآٱ]/g, "ا")
      .replace(/ة/g, "ه")
      .replace(/ى/g, "ي")
      .replace(/ؤ/g, "و")
      .replace(/ئ/g, "ي")
      .replace(/\s+/g, " ")
      .trim();
  }

  // Converts Arabic-Indic digits (٠١٢) to 012
  function toLatinDigits(text) {
    return String(text || "")
      .replace(/[٠-٩]/g, function (d) { return String(d.charCodeAt(0) - 0x0660); })
      .replace(/[۰-۹]/g, function (d) { return String(d.charCodeAt(0) - 0x06F0); });
  }

  /* ---------- Shared page pieces ---------- */

  function productUrl(product) {
    return "product.html?id=" + encodeURIComponent(product.id);
  }

  function priceSummary(product) {
    var prices = product.variants.filter(function (v) { return v.priceBaisa !== null; }).map(function (v) { return v.priceBaisa; });
    if (!prices.length) return null;
    var min = Math.min.apply(null, prices), max = Math.max.apply(null, prices);
    return { min: min, max: max, varies: min !== max };
  }

  function isAvailable(product) {
    return product.variants.some(function (v) { return v.available; });
  }

  function imageEl(image, extra) {
    var img = el("img", Object.assign({ src: image.src, alt: image.alt, loading: "lazy", decoding: "async", width: 800, height: 800 }, extra || {}));
    img.addEventListener("error", function onError() {
      img.removeEventListener("error", onError);
      img.src = FALLBACK_IMAGE;
    });
    return img;
  }

  // index (optional) staggers the entrance animation of cards in a grid
  function productCard(product, index) {
    var summary = priceSummary(product);
    var available = isAvailable(product);
    var swatches = product.variants.filter(function (v) { return v.swatch; }).slice(0, 5);

    var priceNode = summary
      ? (summary.varies ? el("span", null, [t("price.from"), priceEl(summary.min)]) : priceEl(summary.min))
      : el("span", { className: "muted", text: t("card.noPrice") });

    return el("li", { className: "product-card rise", style: { "--i": String(Math.min(index || 0, 8)) } }, [
      el("div", { className: "thumb" }, [
        imageEl(product.images[0]),
        product.sample ? el("span", { className: "badge", text: t("card.sample") }) : null,
        available ? null : el("span", { className: "badge badge-out", text: t("card.out") })
      ]),
      el("h3", null, [el("a", { href: productUrl(product), text: product.name })]),
      el("div", { className: "meta" }, [
        priceNode,
        swatches.length
          ? el("span", { className: "swatch-row", "aria-label": t("card.options", { n: product.variants.length }) }, swatches.map(function (v) {
              return el("span", { className: "swatch-dot", style: { background: v.swatch }, "aria-hidden": "true" });
            }))
          : null
      ])
    ]);
  }

  function renderNotices(container, messages, catalog) {
    if (!container) return;
    container.textContent = "";
    if (catalog && catalog.products.some(function (p) { return p.sample; })) {
      container.appendChild(el("p", { className: "notice notice-sample", role: "note" }, [
        el("strong", { text: t("notice.sampleLabel") }),
        t("notice.sample")
      ]));
    }
    if (messages && messages.length) {
      container.appendChild(el("div", { className: "notice notice-warn", role: "status" }, [
        el("strong", { text: t("notice.cartUpdated") }),
        el("ul", null, messages.map(function (m) { return el("li", { text: m }); }))
      ]));
    }
  }

  function fillSiteChrome(settings) {
    document.querySelectorAll("[data-brand-name]").forEach(function (n) { n.textContent = settings.brandName; });
    document.querySelectorAll("[data-brand-tagline]").forEach(function (n) { n.textContent = settings.brandTagline; });
    document.querySelectorAll("[data-instagram-link]").forEach(function (n) {
      if (settings.instagramUrl) {
        n.href = settings.instagramUrl;
        n.textContent = t("footer.instagram") + " " + (settings.instagramHandle || "");
        n.hidden = false;
      } else {
        n.hidden = true;
      }
    });
    document.querySelectorAll("[data-year]").forEach(function (n) { n.textContent = String(new Date().getFullYear()); });
  }

  function showLoadError(container) {
    if (!container) return;
    container.textContent = "";
    container.appendChild(el("div", { className: "notice notice-error", role: "alert" }, [
      el("strong", { text: t("load.error") }),
      t("load.retry"),
      location.protocol === "file:"
        ? el("p", { text: t("load.file") })
        : null
    ]));
  }

  // Every page calls Sula.boot() first.
  function boot() {
    updateCartCount();
    watchHeader();
    return Promise.all([fetchJSON("data/settings.json"), fetchJSON("data/products.json")]).then(function (results) {
      var settings = normalizeSettings(results[0]);
      currencyLabel = settings.currencyLabel;
      var catalog = normalizeCatalog(results[1]);
      var checked = validateCart(catalog, settings);
      fillSiteChrome(settings);
      renderNotices(document.getElementById("notices"), checked.notices, catalog);
      return { settings: settings, catalog: catalog, cart: checked.items, cartNotices: checked.notices };
    }).catch(function (error) {
      console.error(error);
      showLoadError(document.getElementById("notices"));
      throw error;
    });
  }

  window.Sula = {
    el: el,
    toBaisa: toBaisa,
    formatBaisa: formatBaisa,
    priceEl: priceEl,
    boot: boot,
    toast: toast,
    t: t,
    lang: I.lang,
    countText: I.countText,
    writeCart: writeCart,
    addToCart: addToCart,
    cartLines: cartLines,
    subtotalBaisa: subtotalBaisa,
    itemLabel: itemLabel,
    normalizeSearch: normalizeSearch,
    toLatinDigits: toLatinDigits,
    productUrl: productUrl,
    productCard: productCard,
    priceSummary: priceSummary,
    isAvailable: isAvailable,
    imageEl: imageEl,
    storageGet: storageGet,
    storageSet: storageSet,
    checkWhatsAppNumber: checkWhatsAppNumber
  };
})();
