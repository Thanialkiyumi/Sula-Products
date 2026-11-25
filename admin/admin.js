/* Sula Products — the shop owner's admin page.
   Products and shop settings are loaded from /api/data and saved with /api/save
   (see worker/index.js). Every save publishes straight to the live shop. */
(function () {
  "use strict";

  /* ---------- Words in both languages ---------- */
  var WORDS = {
    ar: {
      title: "لوحة التحكم", brandSub: "لوحة تحكم المتجر",
      loginTitle: "تسجيل الدخول", loginHint: "اكتبي كلمة المرور لإدارة منتجات المتجر.",
      password: "كلمة المرور", showPassword: "إظهار", login: "دخول", loggingIn: "جارٍ الدخول…",
      wrongPassword: "كلمة المرور غير صحيحة. حاولي مرة أخرى.",
      logout: "خروج", viewShop: "عرض المتجر", lang: "English",
      tabProducts: "المنتجات", tabSettings: "إعدادات المتجر",
      loading: "جارٍ التحميل…", loadFail: "تعذّر تحميل البيانات. تأكدي من الاتصال بالإنترنت ثم أعيدي المحاولة.", retry: "إعادة المحاولة",
      search: "ابحثي عن منتج", all: "الكل", addProduct: "إضافة منتج", productsCount: "{n} منتج",
      noResults: "لا توجد منتجات مطابقة.",
      edit: "تعديل", moveUp: "تحريك لأعلى", moveDown: "تحريك لأسفل",
      hidden: "مخفي", featured: "مميز", soldOut: "غير متوفر", tbc: "السعر يُحدد لاحقاً", omr: "ر.ع.",
      newProduct: "منتج جديد", editProduct: "تعديل المنتج", back: "رجوع",
      photos: "الصور", photosHint: "الصورة الأولى هي الصورة الرئيسية في المتجر.", addPhoto: "إضافة صورة",
      removePhoto: "حذف الصورة", makeMain: "جعلها الرئيسية", main: "الرئيسية", preparingPhoto: "جارٍ تجهيز الصورة…", photoFail: "تعذّر فتح هذه الصورة. جرّبي صورة أخرى.",
      details: "معلومات المنتج", nameAr: "اسم المنتج (عربي)", nameEn: "اسم المنتج (English)", optional: "اختياري",
      category: "القسم", descAr: "الوصف (عربي)", descEn: "الوصف (English)",
      priceSection: "السعر والألوان", oneOption: "سعر واحد", manyOptions: "عدة ألوان أو أنواع",
      price: "السعر (ر.ع.)", pricePh: "مثال: 3.500", priceTbc: "السعر يُحدد لاحقاً (لا يمكن طلبه)",
      inStock: "متوفر", optionLabel: "اسم الخيار", optionLabelPh: "مثال: اللون أو النوع",
      shadeAr: "اسم اللون (عربي)", shadeEn: "اسم اللون (English)", color: "لون الدائرة", noColor: "بدون",
      addShade: "إضافة لون أو نوع", removeShade: "حذف", samePrice: "نفس السعر للكل", samePricePrompt: "السعر لكل الألوان",
      apply: "تطبيق", shadeN: "الخيار {n}",
      visibility: "الظهور في المتجر", showFeatured: "يظهر في قسم المنتجات المميزة", hideProduct: "إخفاء المنتج من المتجر (مسودة)",
      save: "حفظ ونشر", cancel: "إلغاء", deleteProduct: "حذف المنتج",
      confirmDelete: "حذف «{name}» نهائياً من المتجر؟", yesDelete: "نعم، احذفي", keep: "لا",
      confirmLeave: "لديك تغييرات لم تُحفظ. الخروج بدون حفظ؟", leave: "خروج بدون حفظ", stay: "البقاء",
      confirmOne: "سيتم الإبقاء على الخيار الأول فقط وحذف البقية. متابعة؟", yes: "نعم",
      errName: "اكتبي اسم المنتج بالعربي.", errPrice: "اكتبي السعر بالأرقام (مثال 3.500) أو اختاري «السعر يُحدد لاحقاً».",
      errShade: "اكتبي اسم كل لون أو نوع.", errCategory: "اختاري القسم.",
      saving: "جارٍ الحفظ…", savedWait: "تم الحفظ. سيظهر التغيير في المتجر خلال دقيقة أو دقيقتين…",
      live: "تم! التغيير ظاهر الآن في المتجر.", liveSlow: "تم الحفظ. قد يتأخر ظهور التغيير قليلاً، حدّثي صفحة المتجر بعد قليل.",
      nothingChanged: "لا توجد تغييرات للحفظ.",
      errChanged: "تم تعديل المتجر من مكان آخر. سيتم تحميل آخر نسخة، ثم أعيدي التعديل.",
      errSignedOut: "انتهت الجلسة. سجّلي الدخول مرة أخرى.", errNetwork: "لا يوجد اتصال بالإنترنت. حاولي مرة أخرى.",
      errSetup: "تعذّر الحفظ بسبب مشكلة في إعدادات الموقع. تواصلي مع الدعم الفني.", errGeneric: "تعذّر الحفظ. حاولي مرة أخرى بعد قليل.",
      errWhatsapp: "رقم واتساب غير صحيح. اكتبيه مع رمز الدولة، مثال 96891234567.",
      errTooBig: "الصور كبيرة جداً. احفظي عدداً أقل من الصور في المرة الواحدة.",
      settingsTitle: "إعدادات المتجر", whatsapp: "رقم واتساب لاستقبال الطلبات", whatsappHint: "مع رمز الدولة وبدون + أو مسافات. مثال: 96891234567",
      instagram: "رابط حساب إنستغرام", instagramHandle: "اسم الحساب كما يظهر", introAr: "رسالة الترحيب (عربي)", introEn: "رسالة الترحيب (English)",
      deliverySection: "التوصيل والاستلام", deliveryOn: "يوجد توصيل", pickupOn: "يوجد استلام من المتجر",
      deliveryFee: "رسوم التوصيل (ر.ع.)", deliveryFeeHint: "اتركيها فارغة إذا كانت الرسوم تُحدد مع الزبونة عبر واتساب.",
      deliveryNoteAr: "ملاحظة التوصيل (عربي)", deliveryNoteEn: "ملاحظة التوصيل (English)",
      pickupNoteAr: "ملاحظة الاستلام (عربي)", pickupNoteEn: "ملاحظة الاستلام (English)",
      maxQty: "أكبر كمية لكل منتج في الطلب", errDelivery: "اختاري التوصيل أو الاستلام أو كليهما.",
      saveSettings: "حفظ الإعدادات",
      categoriesTitle: "أقسام المتجر", categoriesHint: "الأقسام التي تظهر في المتجر، بالترتيب.",
      catNameAr: "اسم القسم (عربي)", catNameEn: "اسم القسم (English)", addCategory: "إضافة قسم", removeCategory: "حذف القسم",
      catInUse: "لا يمكن حذف قسم فيه منتجات. انقلي المنتجات إلى قسم آخر أولاً.", saveCategories: "حفظ الأقسام", errCatName: "اكتبي اسم كل قسم بالعربي.",
      help: "مساعدة", helpText: "كل ضغطة على «حفظ ونشر» تنشر التغيير في المتجر مباشرة، ويظهر خلال دقيقة أو دقيقتين. الأسعار بالريال العُماني بثلاث خانات (مثال 2.500)."
    },
    en: {
      title: "Admin", brandSub: "Shop admin",
      loginTitle: "Sign in", loginHint: "Type the password to manage the shop's products.",
      password: "Password", showPassword: "Show", login: "Sign in", loggingIn: "Signing in…",
      wrongPassword: "That password is not right. Please try again.",
      logout: "Sign out", viewShop: "View shop", lang: "العربية",
      tabProducts: "Products", tabSettings: "Shop settings",
      loading: "Loading…", loadFail: "Could not load the data. Check your internet connection and try again.", retry: "Try again",
      search: "Search products", all: "All", addProduct: "Add product", productsCount: "{n} products",
      noResults: "No matching products.",
      edit: "Edit", moveUp: "Move up", moveDown: "Move down",
      hidden: "Hidden", featured: "Featured", soldOut: "Sold out", tbc: "Price to be confirmed", omr: "OMR",
      newProduct: "New product", editProduct: "Edit product", back: "Back",
      photos: "Photos", photosHint: "The first photo is the main photo in the shop.", addPhoto: "Add photo",
      removePhoto: "Remove photo", makeMain: "Make main", main: "Main", preparingPhoto: "Preparing photo…", photoFail: "Could not open this photo. Try another one.",
      details: "Product details", nameAr: "Product name (Arabic)", nameEn: "Product name (English)", optional: "optional",
      category: "Category", descAr: "Description (Arabic)", descEn: "Description (English)",
      priceSection: "Price and shades", oneOption: "One price", manyOptions: "Several shades or types",
      price: "Price (OMR)", pricePh: "e.g. 3.500", priceTbc: "Price to be confirmed (cannot be ordered)",
      inStock: "In stock", optionLabel: "Option name", optionLabelPh: "e.g. Shade or Type",
      shadeAr: "Shade name (Arabic)", shadeEn: "Shade name (English)", color: "Dot colour", noColor: "None",
      addShade: "Add shade or type", removeShade: "Remove", samePrice: "Same price for all", samePricePrompt: "Price for every shade",
      apply: "Apply", shadeN: "Option {n}",
      visibility: "Showing in the shop", showFeatured: "Show in the featured products", hideProduct: "Hide this product from the shop (draft)",
      save: "Save and publish", cancel: "Cancel", deleteProduct: "Delete product",
      confirmDelete: "Delete “{name}” from the shop for good?", yesDelete: "Yes, delete", keep: "No",
      confirmLeave: "You have unsaved changes. Leave without saving?", leave: "Leave without saving", stay: "Stay",
      confirmOne: "Only the first option will be kept and the others removed. Continue?", yes: "Yes",
      errName: "Type the product name in Arabic.", errPrice: "Type the price in numbers (e.g. 3.500) or tick “Price to be confirmed”.",
      errShade: "Type a name for every shade or type.", errCategory: "Choose a category.",
      saving: "Saving…", savedWait: "Saved. The shop will show it in a minute or two…",
      live: "Done! The change is live in the shop.", liveSlow: "Saved. It may take a little longer to show; refresh the shop in a moment.",
      nothingChanged: "Nothing to save.",
      errChanged: "The shop was changed somewhere else. The latest version will load; then make your change again.",
      errSignedOut: "Your session ended. Please sign in again.", errNetwork: "No internet connection. Please try again.",
      errSetup: "Saving failed because of a site setup problem. Please contact support.", errGeneric: "Saving failed. Please try again shortly.",
      errWhatsapp: "That WhatsApp number is not valid. Include the country code, e.g. 96891234567.",
      errTooBig: "The photos are too large. Save fewer photos at a time.",
      settingsTitle: "Shop settings", whatsapp: "WhatsApp number for orders", whatsappHint: "With the country code, no + or spaces. Example: 96891234567",
      instagram: "Instagram profile link", instagramHandle: "Account name as shown", introAr: "Welcome message (Arabic)", introEn: "Welcome message (English)",
      deliverySection: "Delivery and pickup", deliveryOn: "Delivery available", pickupOn: "Pickup available",
      deliveryFee: "Delivery fee (OMR)", deliveryFeeHint: "Leave empty if the fee is agreed with the customer on WhatsApp.",
      deliveryNoteAr: "Delivery note (Arabic)", deliveryNoteEn: "Delivery note (English)",
      pickupNoteAr: "Pickup note (Arabic)", pickupNoteEn: "Pickup note (English)",
      maxQty: "Largest quantity per item in an order", errDelivery: "Choose delivery, pickup, or both.",
      saveSettings: "Save settings",
      categoriesTitle: "Shop categories", categoriesHint: "The categories shown in the shop, in order.",
      catNameAr: "Category name (Arabic)", catNameEn: "Category name (English)", addCategory: "Add category", removeCategory: "Remove category",
      catInUse: "A category with products cannot be removed. Move its products to another category first.", saveCategories: "Save categories", errCatName: "Type an Arabic name for every category.",
      help: "Help", helpText: "Each press of “Save and publish” updates the live shop; it shows within a minute or two. Prices are in Omani rials with three decimals (e.g. 2.500)."
    }
  };

  var lang = "ar";
  try { if (localStorage.getItem("sula-admin-lang") === "en") lang = "en"; } catch (e) {}
  function t(key, vars) {
    var s = (WORDS[lang][key] !== undefined ? WORDS[lang][key] : WORDS.ar[key]) || key;
    if (vars) Object.keys(vars).forEach(function (k) { s = s.replace("{" + k + "}", vars[k]); });
    return s;
  }

  /* ---------- Small helpers ---------- */
  function el(tag, attrs, kids) {
    var n = document.createElement(tag);
    if (attrs) Object.keys(attrs).forEach(function (k) {
      var v = attrs[k];
      if (v === undefined || v === null || v === false) return;
      if (k === "className") n.className = v;
      else if (k === "text") n.textContent = v;
      else if (k.slice(0, 2) === "on") n.addEventListener(k.slice(2).toLowerCase(), v);
      else if (k === "value") n.value = v;
      else if (k === "checked") n.checked = !!v;
      else n.setAttribute(k, v === true ? "" : v);
    });
    (kids || []).forEach(function (c) { if (c !== null && c !== undefined && c !== false) n.appendChild(typeof c === "string" ? document.createTextNode(c) : c); });
    return n;
  }
  function clone(x) { return JSON.parse(JSON.stringify(x)); }
  function pick(obj, key) { return (lang === "en" && obj[key + "_en"]) || obj[key] || obj[key + "_en"] || ""; }
  function slug(s) { return String(s || "").toLowerCase().normalize("NFKD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 50); }
  function shortId() { return Date.now().toString(36).slice(-5) + Math.random().toString(36).slice(2, 5); }
  // Accepts Arabic digits and the Arabic decimal mark too: ٣٫٥٠٠ → 3.5
  function parsePrice(s) {
    s = String(s === null || s === undefined ? "" : s).trim()
      .replace(/[٠-٩]/g, function (d) { return String(d.charCodeAt(0) - 0x660); })
      .replace(/[۰-۹]/g, function (d) { return String(d.charCodeAt(0) - 0x6F0); })
      .replace(/[٫,،]/g, ".").replace(/[^\d.]/g, "");
    if (!s || !/^\d+(\.\d+)?$/.test(s)) return NaN;
    return Math.round(Number(s) * 1000) / 1000;
  }
  function money(n) { return Number(n).toFixed(3) + " " + t("omr"); }
  function imgUrl(src) { return previews[src] || ("../" + src); }

  var TOKEN_KEY = "sula-admin-session";
  function getToken() { try { return localStorage.getItem(TOKEN_KEY) || ""; } catch (e) { return memToken; } }
  var memToken = "";
  function setToken(v) { memToken = v || ""; try { if (v) localStorage.setItem(TOKEN_KEY, v); else localStorage.removeItem(TOKEN_KEY); } catch (e) {} }

  function api(method, path, body) {
    return fetch(path, {
      method: method,
      headers: Object.assign({ "Content-Type": "application/json" }, getToken() ? { Authorization: "Bearer " + getToken() } : {}),
      body: body ? JSON.stringify(body) : undefined,
      cache: "no-store"
    }).then(function (res) {
      return res.json().catch(function () { return {}; }).then(function (data) {
        if (!res.ok) { var err = new Error(data.error || "http_" + res.status); err.code = data.error || "http_" + res.status; err.status = res.status; throw err; }
        return data;
      });
    }, function () { var err = new Error("network"); err.code = "network"; throw err; });
  }

  function errorText(err) {
    var c = err && err.code;
    if (c === "changed_elsewhere") return t("errChanged");
    if (c === "signed_out") return t("errSignedOut");
    if (c === "network") return t("errNetwork");
    if (c === "bad_whatsapp") return t("errWhatsapp");
    if (c === "bad_delivery") return t("errDelivery");
    if (c === "too_large" || (err && err.status === 413)) return t("errTooBig");
    if (c === "not_configured" || c === "store_key_rejected") return t("errSetup");
    return t("errGeneric");
  }

  /* ---------- State ---------- */
  var state = { view: "login", tab: "products", filter: "all", query: "", data: null, productsSha: null, settingsSha: null };
  var previews = {}; // new photo path → data URL, shown until the shop has published it
  var app = document.getElementById("app");
  var dirty = false;

  window.addEventListener("beforeunload", function (e) { if (dirty) { e.preventDefault(); e.returnValue = ""; } });

  function setLang(next) {
    lang = next;
    try { localStorage.setItem("sula-admin-lang", lang); } catch (e) {}
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "en" ? "ltr" : "rtl";
    render();
  }

  /* ---------- Messages: status bar and confirm box ---------- */
  var statusNode = null, statusTimer = null;
  function status(msg, kind, keep) {
    if (!statusNode) { statusNode = el("div", { className: "status", role: "status" }); document.body.appendChild(statusNode); }
    clearTimeout(statusTimer);
    statusNode.className = "status show " + (kind || "");
    statusNode.textContent = msg;
    if (!keep) statusTimer = setTimeout(function () { statusNode.className = "status"; }, kind === "error" ? 9000 : 5000);
  }

  function hideStatus() { if (statusNode && / busy/.test(statusNode.className)) { clearTimeout(statusTimer); statusNode.className = "status"; } }

  function confirmBox(message, yesLabel, noLabel, danger) {
    return new Promise(function (resolve) {
      var box = el("div", { className: "modal-back", role: "dialog", "aria-modal": "true" });
      function close(v) { box.remove(); resolve(v); }
      var yesBtn = el("button", { className: "btn " + (danger ? "btn-danger" : "btn-primary"), type: "button", text: yesLabel, onclick: function () { close(true); } });
      box.appendChild(el("div", { className: "modal" }, [
        el("p", { text: message }),
        el("div", { className: "modal-actions" }, [
          yesBtn,
          el("button", { className: "btn", type: "button", text: noLabel, onclick: function () { close(false); } })
        ])
      ]));
      box.addEventListener("click", function (e) { if (e.target === box) close(false); });
      document.body.appendChild(box);
      yesBtn.focus();
    });
  }

  /* ---------- Saving ---------- */
  var saving = false;
  function save(parts) {
    if (saving) return Promise.reject({ code: "busy" });
    saving = true;
    status(t("saving"), "busy", true);
    var body = { uploads: parts.uploads || [] };
    if (parts.products) { body.products = parts.products; body.productsSha = state.productsSha; }
    if (parts.settings) { body.settings = parts.settings; body.settingsSha = state.settingsSha; }
    return api("POST", "/api/save", body).then(function (res) {
      saving = false;
      if (parts.products) { state.data.products = parts.products.products; state.data.categories = parts.products.categories; state.productsSha = res.productsSha; }
      if (parts.settings) { state.data.settings = parts.settings; state.settingsSha = res.settingsSha; }
      if (res.unchanged) { status(t("nothingChanged"), "ok"); return res; }
      status(t("savedWait"), "busy", true);
      watchLive(res);
      return res;
    }, function (err) {
      saving = false;
      status(errorText(err), "error");
      if (err.code === "signed_out") { setToken(""); dirty = false; state.view = "login"; render(); }
      if (err.code === "changed_elsewhere") { dirty = false; loadData(); }
      throw err;
    });
  }

  // Checks the live shop until it shows what was just saved
  var watchId = 0;
  function watchLive(res) {
    var id = ++watchId, tries = 0;
    var checks = [];
    if (res.productsText) checks.push({ url: "/data/products.json", text: res.productsText });
    if (res.settingsText) checks.push({ url: "/data/settings.json", text: res.settingsText });
    function tick() {
      if (id !== watchId) return;
      tries++;
      Promise.all(checks.map(function (c) {
        return fetch(c.url + "?check=" + Date.now(), { cache: "no-store" }).then(function (r) { return r.text(); }).then(function (txt) { return txt === c.text; }, function () { return false; });
      })).then(function (oks) {
        if (id !== watchId) return;
        if (oks.every(Boolean)) { status(t("live"), "ok"); return; }
        if (tries >= 36) { status(t("liveSlow"), "ok"); return; }
        setTimeout(tick, 5000);
      });
    }
    setTimeout(tick, 8000);
  }

  /* ---------- Photos ---------- */
  // Shrinks a phone photo to at most 1200px so the shop stays fast
  function preparePhoto(file) {
    return new Promise(function (resolve, reject) {
      var url = URL.createObjectURL(file);
      var img = new Image();
      img.onload = function () {
        var max = 1200, w = img.naturalWidth, h = img.naturalHeight;
        var scale = Math.min(1, max / Math.max(w, h));
        var canvas = document.createElement("canvas");
        canvas.width = Math.round(w * scale); canvas.height = Math.round(h * scale);
        var ctx = canvas.getContext("2d");
        ctx.fillStyle = "#FFFFFF"; ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        URL.revokeObjectURL(url);
        resolve(canvas.toDataURL("image/jpeg", 0.85));
      };
      img.onerror = function () { URL.revokeObjectURL(url); reject(new Error("photo")); };
      img.src = url;
    });
  }

  /* ---------- Screens ---------- */
  function render() {
    document.title = "Sula Products · " + t("title");
    app.innerHTML = "";
    if (state.view === "login") return renderLogin();
    if (state.view === "loading") return app.appendChild(shell([el("p", { className: "center muted", text: t("loading") })]));
    if (state.view === "loadfail") return app.appendChild(shell([el("div", { className: "center" }, [
      el("p", { text: t("loadFail") }), el("button", { className: "btn btn-primary", type: "button", text: t("retry"), onclick: loadData })
    ])]));
    if (state.view === "edit") return renderEditor();
    app.appendChild(shell([tabs(), state.tab === "products" ? productList() : settingsPage()]));
  }

  function langButton() {
    return el("button", { className: "link-btn", type: "button", text: t("lang"), lang: lang === "ar" ? "en" : "ar", onclick: function () { setLang(lang === "ar" ? "en" : "ar"); } });
  }

  function shell(content) {
    return el("div", { className: "page" }, [
      el("header", { className: "topbar" }, [
        el("div", { className: "brand" }, [el("span", { className: "logo", text: "Sula Products" }), el("span", { className: "brand-sub", text: t("brandSub") })]),
        el("nav", { className: "top-actions" }, [
          el("a", { className: "link-btn", href: "/", target: "_blank", rel: "noopener", text: t("viewShop") }),
          langButton(),
          el("button", { className: "link-btn", type: "button", text: t("logout"), onclick: function () { setToken(""); state.view = "login"; state.data = null; render(); } })
        ])
      ]),
      el("main", { className: "content", id: "main" }, content)
    ]);
  }

  function renderLogin() {
    var input = el("input", { type: "password", id: "pw", autocomplete: "current-password", required: true, dir: "ltr" });
    var msg = el("p", { className: "form-error", role: "alert" });
    var btn = el("button", { className: "btn btn-primary btn-block", type: "submit", text: t("login") });
    var form = el("form", { className: "login-card", onsubmit: function (e) {
      e.preventDefault();
      if (!input.value) return input.focus();
      btn.disabled = true; btn.textContent = t("loggingIn"); msg.textContent = "";
      api("POST", "/api/login", { password: input.value }).then(function (res) {
        setToken(res.token); loadData();
      }, function (err) {
        btn.disabled = false; btn.textContent = t("login");
        msg.textContent = err.code === "wrong_password" ? t("wrongPassword") : err.code === "not_configured" ? t("errSetup") : errorText(err);
        input.select();
      });
    } }, [
      el("div", { className: "login-logo", text: "Sula Products" }),
      el("h1", { text: t("loginTitle") }),
      el("p", { className: "muted", text: t("loginHint") }),
      el("label", { for: "pw", text: t("password") }),
      el("div", { className: "pw-row" }, [input, el("button", { className: "link-btn", type: "button", text: t("showPassword"), onclick: function () { input.type = input.type === "password" ? "text" : "password"; input.focus(); } })]),
      msg, btn,
      el("div", { className: "login-foot" }, [langButton()])
    ]);
    app.appendChild(el("div", { className: "login-page" }, [form]));
    input.focus();
  }

  function tabs() {
    return el("div", { className: "tabs", role: "tablist" }, ["products", "settings"].map(function (id) {
      return el("button", { type: "button", role: "tab", className: "tab" + (state.tab === id ? " active" : ""), "aria-selected": state.tab === id ? "true" : "false",
        text: t(id === "products" ? "tabProducts" : "tabSettings"), onclick: function () { state.tab = id; render(); } });
    }));
  }

  function priceSummary(p) {
    var prices = p.variants.map(function (v) { return v.price; }).filter(function (x) { return typeof x === "number"; });
    if (!prices.length) return t("tbc");
    var lo = Math.min.apply(null, prices), hi = Math.max.apply(null, prices);
    return lo === hi ? money(lo) : Number(lo).toFixed(3) + " – " + money(hi);
  }

  function productList() {
    var data = state.data;
    var q = state.query.trim().toLowerCase();
    var list = data.products.map(function (p, i) { return { p: p, i: i }; }).filter(function (x) {
      if (state.filter !== "all" && x.p.category !== state.filter) return false;
      if (!q) return true;
      return [x.p.name, x.p.name_en, x.p.id].concat(x.p.variants.map(function (v) { return (v.shade || "") + " " + (v.shade_en || ""); })).join(" ").toLowerCase().indexOf(q) !== -1;
    });

    var searchBox = el("input", { type: "search", className: "search", placeholder: t("search"), "aria-label": t("search"), value: state.query, oninput: function (e) {
      state.query = e.target.value; var pos = e.target.selectionStart; render();
      var s = app.querySelector(".search"); if (s) { s.focus(); try { s.setSelectionRange(pos, pos); } catch (er) {} }
    } });

    var chips = el("div", { className: "chips" }, [{ id: "all", name: t("all") }].concat(data.categories.map(function (c) { return { id: c.id, name: pick(c, "name") }; })).map(function (c) {
      return el("button", { type: "button", className: "chip" + (state.filter === c.id ? " active" : ""), text: c.name, onclick: function () { state.filter = c.id; render(); } });
    }));

    var canMove = state.filter === "all" && !q;
    var rows = list.map(function (x) {
      var p = x.p;
      var thumb = p.images[0] ? el("img", { src: imgUrl(p.images[0].src), alt: "", loading: "lazy" }) : el("span", { className: "no-photo" });
      var allOut = p.variants.every(function (v) { return !v.available; });
      return el("li", { className: "row" + (p.status === "draft" ? " is-hidden" : "") }, [
        el("button", { type: "button", className: "row-main", onclick: function () { openEditor(x.i); } }, [
          el("span", { className: "thumb" }, [thumb]),
          el("span", { className: "row-text" }, [
            el("span", { className: "row-name", text: pick(p, "name") }),
            el("span", { className: "row-meta", text: priceSummary(p) + (p.variants.length > 1 ? " · " + p.variants.length + " " + (lang === "ar" ? "خيارات" : "options") : "") }),
            el("span", { className: "badges" }, [
              p.status === "draft" ? el("span", { className: "badge badge-grey", text: t("hidden") }) : null,
              p.featured ? el("span", { className: "badge badge-pink", text: t("featured") }) : null,
              allOut ? el("span", { className: "badge badge-warn", text: t("soldOut") }) : null
            ])
          ]),
          el("span", { className: "row-edit", text: t("edit") })
        ]),
        canMove ? el("span", { className: "row-move" }, [
          el("button", { type: "button", className: "icon-btn", "aria-label": t("moveUp"), title: t("moveUp"), disabled: x.i === 0, onclick: function () { move(x.i, -1); } }, ["▲"]),
          el("button", { type: "button", className: "icon-btn", "aria-label": t("moveDown"), title: t("moveDown"), disabled: x.i === data.products.length - 1, onclick: function () { move(x.i, 1); } }, ["▼"])
        ]) : null
      ]);
    });

    return el("section", {}, [
      el("div", { className: "list-head" }, [
        el("h1", { text: t("tabProducts") }),
        el("button", { type: "button", className: "btn btn-primary", onclick: function () { openEditor(-1); } }, ["+ " + t("addProduct")])
      ]),
      el("p", { className: "muted small", text: t("helpText") }),
      searchBox, chips,
      el("p", { className: "muted small", text: t("productsCount", { n: list.length }) }),
      rows.length ? el("ul", { className: "rows" }, rows) : el("p", { className: "center muted", text: t("noResults") })
    ]);
  }

  function move(i, dir) {
    var before = state.data.products;
    var products = clone(before);
    var j = i + dir;
    if (j < 0 || j >= products.length || saving) return;
    var tmp = products[i]; products[i] = products[j]; products[j] = tmp;
    // Show the new order straight away; it is put back if the save fails
    state.data.products = products; render();
    save({ products: { categories: state.data.categories, products: products } }).then(null, function () {
      if (state.data.products === products) { state.data.products = before; render(); }
    });
  }

  /* ---------- Product editor ---------- */
  var draft = null, draftIndex = -1, draftUploads = [];

  function openEditor(index) {
    draftIndex = index;
    draftUploads = [];
    if (index >= 0) draft = clone(state.data.products[index]);
    else draft = { id: "", name: "", name_en: "", category: state.filter !== "all" ? state.filter : (state.data.categories[0] || {}).id, description: "", description_en: "", featured: false, images: [], variants: [{ id: "", price: null, available: true }] };
    draft._many = draft.variants.length > 1 || draft.variants.some(function (v) { return v.shade || v.shade_en; });
    dirty = false;
    state.view = "edit";
    render();
    window.scrollTo(0, 0);
  }

  function closeEditor(force) {
    var go = function () { dirty = false; state.view = "main"; draft = null; render(); };
    if (!dirty || force) return go();
    confirmBox(t("confirmLeave"), t("leave"), t("stay")).then(function (ok) { if (ok) go(); });
  }

  function field(label, input, hint) {
    var id = "f" + Math.random().toString(36).slice(2, 8);
    input.id = id;
    return el("div", { className: "field" }, [el("label", { for: id, text: label }), input, hint ? el("p", { className: "hint", text: hint }) : null]);
  }
  function textInput(value, onInput, attrs) {
    return el("input", Object.assign({ type: "text", value: value || "", oninput: function (e) { dirty = true; onInput(e.target.value); } }, attrs || {}));
  }
  function textArea(value, onInput, attrs) {
    return el("textarea", Object.assign({ rows: 3, oninput: function (e) { dirty = true; onInput(e.target.value); } }, attrs || {}), [value || ""]);
  }
  function check(label, value, onChange) {
    return el("label", { className: "check" }, [el("input", { type: "checkbox", checked: value, onchange: function (e) { dirty = true; onChange(e.target.checked); } }), el("span", { text: label })]);
  }

  function renderEditor() {
    var p = draft;
    var errorBox = el("div", { className: "form-error big", role: "alert" });

    // Photos
    var fileInput = el("input", { type: "file", accept: "image/*", multiple: true, className: "visually-hidden", id: "photo-input", onchange: function (e) {
      var files = Array.prototype.slice.call(e.target.files || []);
      e.target.value = "";
      if (!files.length) return;
      status(t("preparingPhoto"), "busy", true);
      files.reduce(function (chain, file) {
        return chain.then(function () {
          return preparePhoto(file).then(function (dataUrl) {
            var base = slug(p.name_en) || slug(p.id) || "product";
            var path = "images/products/" + base.slice(0, 40) + "-" + shortId() + ".jpg";
            previews[path] = dataUrl;
            draftUploads.push({ path: path, base64: dataUrl.split(",")[1] });
            p.images.push({ src: path });
            dirty = true;
          }, function () { status(t("photoFail"), "error"); });
        });
      }, Promise.resolve()).then(function () { hideStatus(); render(); });
    } });
    var photos = el("div", { className: "photos" }, p.images.map(function (img, i) {
      return el("figure", { className: "photo" + (i === 0 ? " is-main" : "") }, [
        el("img", { src: imgUrl(img.src), alt: "" }),
        i === 0 ? el("span", { className: "photo-tag", text: t("main") }) : el("button", { type: "button", className: "photo-btn", text: t("makeMain"), onclick: function () {
          p.images.unshift(p.images.splice(i, 1)[0]); dirty = true; render();
        } }),
        el("button", { type: "button", className: "photo-x", "aria-label": t("removePhoto"), title: t("removePhoto"), onclick: function () { p.images.splice(i, 1); dirty = true; render(); } }, ["×"])
      ]);
    }).concat([el("label", { className: "photo add-photo", for: "photo-input" }, [el("span", { className: "plus", text: "+" }), el("span", { text: t("addPhoto") })])]));

    // Price and shades
    var catSelect = el("select", { onchange: function (e) { dirty = true; p.category = e.target.value; } }, state.data.categories.map(function (c) {
      var o = el("option", { value: c.id, text: pick(c, "name") }); if (c.id === p.category) o.selected = true; return o;
    }));

    var modeRow = el("div", { className: "segmented", role: "radiogroup" }, [false, true].map(function (many) {
      return el("button", { type: "button", role: "radio", "aria-checked": p._many === many ? "true" : "false", className: "seg" + (p._many === many ? " active" : ""), text: t(many ? "manyOptions" : "oneOption"), onclick: function () {
        if (p._many === many) return;
        if (!many && p.variants.length > 1) {
          confirmBox(t("confirmOne"), t("yes"), t("keep")).then(function (ok) { if (ok) { p.variants = [p.variants[0]]; delete p.variants[0].shade; delete p.variants[0].shade_en; p._many = false; dirty = true; render(); } });
          return;
        }
        if (!many) { delete p.variants[0].shade; delete p.variants[0].shade_en; }
        p._many = many; dirty = true; render();
      } });
    }));

    function priceInput(v) {
      var input = el("input", { type: "text", inputmode: "decimal", dir: "ltr", placeholder: t("pricePh"), value: v._priceText !== undefined ? v._priceText : (typeof v.price === "number" ? v.price.toFixed(3) : ""),
        oninput: function (e) { dirty = true; v._priceText = e.target.value; },
        onblur: function (e) { var n = parsePrice(e.target.value); if (!isNaN(n)) { e.target.value = n.toFixed(3); v._priceText = e.target.value; } } });
      return input;
    }

    function variantBlock(v, i) {
      if (v._tbcTicked === undefined) v._tbcTicked = v.id !== "" && v.price === null;
      var pInput = priceInput(v);
      pInput.disabled = v._tbcTicked;
      var tbc = check(t("priceTbc"), v._tbcTicked, function (on) { v._tbcTicked = on; pInput.disabled = on; if (!on) pInput.focus(); });
      var stock = check(t("inStock"), v.available !== false, function (on) { v.available = on; });
      var parts = [];
      if (p._many) {
        var hasColor = !!v.swatch;
        var colorInput = el("input", { type: "color", value: v.swatch || "#D9A0A8", "aria-label": t("color"), oninput: function (e) { dirty = true; v.swatch = e.target.value.toUpperCase(); noColorBox.querySelector("input").checked = false; } });
        var noColorBox = check(t("noColor"), !hasColor, function (on) { if (on) delete v.swatch; else v.swatch = colorInput.value.toUpperCase(); });
        parts.push(el("div", { className: "variant-head" }, [
          el("strong", { text: t("shadeN", { n: i + 1 }) }),
          v.swatchImage ? el("span", { className: "dot", style: "background-image:url('" + imgUrl(v.swatchImage) + "')" }) : null,
          p.variants.length > 1 ? el("button", { type: "button", className: "link-btn danger", text: t("removeShade"), onclick: function () { p.variants.splice(i, 1); dirty = true; render(); } }) : null
        ]));
        parts.push(el("div", { className: "grid2" }, [
          field(t("shadeAr"), textInput(v.shade, function (x) { v.shade = x; })),
          field(t("shadeEn") + " (" + t("optional") + ")", textInput(v.shade_en, function (x) { v.shade_en = x; }, { dir: "ltr" }))
        ]));
        parts.push(el("div", { className: "grid2" }, [
          field(t("price"), pInput),
          el("div", { className: "field" }, [el("span", { className: "label", text: t("color") }), el("div", { className: "color-row" }, [colorInput, noColorBox])])
        ]));
      } else {
        parts.push(field(t("price"), pInput));
      }
      parts.push(el("div", { className: "checks" }, [tbc, stock]));
      return el("div", { className: p._many ? "variant" : "variant single" }, parts);
    }

    var samePrice = el("div", { className: "same-price" }, [
      el("input", { type: "text", inputmode: "decimal", dir: "ltr", placeholder: t("pricePh"), "aria-label": t("samePricePrompt"), id: "same-price" }),
      el("button", { type: "button", className: "btn btn-small", text: t("samePrice"), onclick: function () {
        var n = parsePrice(document.getElementById("same-price").value);
        if (isNaN(n)) return;
        p.variants.forEach(function (v) { v.price = n; v._priceText = ""; v._tbcTicked = false; });
        dirty = true; render();
      } })
    ]);

    var priceSection = el("section", { className: "card" }, [
      el("h2", { text: t("priceSection") }),
      modeRow,
      p._many ? field(t("optionLabel") + " (" + t("optional") + ")", textInput(p.optionLabel, function (x) { p.optionLabel = x; }, { placeholder: t("optionLabelPh") })) : null,
      p._many && p.variants.length > 1 ? samePrice : null
    ].concat(p.variants.map(variantBlock)).concat([
      p._many ? el("button", { type: "button", className: "btn btn-outline", onclick: function () {
        // Keep typed prices when the list redraws
        p.variants.push({ id: "", shade: "", price: null, available: true, _tbcTicked: false, _priceText: p.variants.length && p.variants[p.variants.length - 1]._priceText || (typeof (p.variants[p.variants.length - 1] || {}).price === "number" ? p.variants[p.variants.length - 1].price.toFixed(3) : "") });
        dirty = true; render();
        var blocks = app.querySelectorAll(".variant"); var last = blocks[blocks.length - 1]; if (last) last.querySelector("input").focus();
      } }, ["+ " + t("addShade")]) : null
    ]));

    var isNew = draftIndex < 0;
    app.appendChild(shell([
      el("div", { className: "editor-head" }, [
        el("button", { type: "button", className: "link-btn", onclick: function () { closeEditor(); } }, [(lang === "ar" ? "→ " : "← ") + t("back")]),
        el("h1", { text: isNew ? t("newProduct") : t("editProduct") })
      ]),
      el("section", { className: "card" }, [el("h2", { text: t("photos") }), el("p", { className: "hint", text: t("photosHint") }), photos, fileInput]),
      el("section", { className: "card" }, [
        el("h2", { text: t("details") }),
        field(t("nameAr"), textInput(p.name, function (x) { p.name = x; }, { required: true })),
        field(t("nameEn") + " (" + t("optional") + ")", textInput(p.name_en, function (x) { p.name_en = x; }, { dir: "ltr" })),
        field(t("category"), catSelect),
        field(t("descAr") + " (" + t("optional") + ")", textArea(p.description, function (x) { p.description = x; })),
        field(t("descEn") + " (" + t("optional") + ")", textArea(p.description_en, function (x) { p.description_en = x; }, { dir: "ltr" }))
      ]),
      priceSection,
      el("section", { className: "card" }, [
        el("h2", { text: t("visibility") }),
        el("div", { className: "checks col" }, [
          check(t("showFeatured"), p.featured === true, function (on) { p.featured = on; }),
          check(t("hideProduct"), p.status === "draft", function (on) { if (on) p.status = "draft"; else delete p.status; })
        ])
      ]),
      errorBox,
      el("div", { className: "save-bar" }, [
        el("button", { type: "button", className: "btn btn-primary", id: "save-product", text: t("save"), onclick: function (e) { saveProduct(e.target, errorBox); } }),
        el("button", { type: "button", className: "btn", text: t("cancel"), onclick: function () { closeEditor(); } }),
        !isNew ? el("button", { type: "button", className: "btn btn-danger-outline push", text: t("deleteProduct"), onclick: deleteProduct }) : null
      ])
    ]));
  }

  function uniqueId(base, taken) {
    var id = base, n = 2;
    while (!id || taken[id]) { id = (base || "item") + "-" + (n++); }
    taken[id] = true;
    return id;
  }

  // Turns the editor's working copy into a clean product, or returns an error message
  function finishDraft() {
    var p = clone(draft);
    p.name = (p.name || "").trim();
    if (!p.name) return { error: t("errName") };
    if (!p.category) return { error: t("errCategory") };
    var allProducts = state.data.products;
    var takenProducts = {}, takenVariants = {};
    allProducts.forEach(function (q, i) {
      if (i !== draftIndex) { takenProducts[q.id] = true; q.variants.forEach(function (v) { takenVariants[v.id] = true; }); }
    });
    if (!p.id) p.id = uniqueId(slug(p.name_en) || "product-" + shortId(), takenProducts);
    var many = p._many;
    for (var i = 0; i < p.variants.length; i++) {
      var v = p.variants[i];
      if (v._tbcTicked) v.price = null;
      else {
        var raw = v._priceText !== undefined && v._priceText !== "" ? v._priceText : (typeof v.price === "number" ? String(v.price) : "");
        var n = parsePrice(raw);
        if (isNaN(n)) return { error: t("errPrice") };
        v.price = n;
      }
      if (many) {
        v.shade = (v.shade || "").trim();
        v.shade_en = (v.shade_en || "").trim();
        if (!v.shade && v.shade_en) v.shade = v.shade_en;
        if (!v.shade) return { error: t("errShade") };
      }
      if (!v.id) v.id = uniqueId(p.id + "-" + (many ? (slug(v.shade_en || v.shade) || shortId()) : "default"), takenVariants);
      else takenVariants[v.id] = true;
      delete v._priceText; delete v._tbcTicked;
    }
    if (many && !(p.optionLabel || "").trim()) { delete p.optionLabel; delete p.optionLabel_en; }
    delete p._many;
    // Photo descriptions for screen readers, taken from the product name
    p.images = p.images.map(function (img) { return img.alt ? img : { src: img.src, alt: p.name, alt_en: p.name_en || undefined }; });
    ["name_en", "description", "description_en", "optionLabel", "optionLabel_en"].forEach(function (k) { if (typeof p[k] === "string" && !p[k].trim()) delete p[k]; });
    // New products get the same field order as the rest of the file
    if (draftIndex < 0) {
      var order = ["id", "name", "name_en", "category", "description", "description_en", "featured", "status", "optionLabel", "optionLabel_en", "images", "variants"];
      var ordered = {}; order.forEach(function (k) { if (p[k] !== undefined) ordered[k] = p[k]; }); p = ordered;
    }
    p.variants = p.variants.map(function (v) {
      var o = {}; ["id", "shade", "shade_en", "swatch", "swatchImage", "image", "price", "available"].forEach(function (k) { if (v[k] !== undefined && v[k] !== "") o[k] = v[k]; });
      if (!("price" in o)) o.price = null; o.available = v.available !== false; return o;
    });
    return { product: p };
  }

  function saveProduct(btn, errorBox) {
    errorBox.textContent = "";
    var out = finishDraft();
    if (out.error) { errorBox.textContent = out.error; errorBox.scrollIntoView({ block: "center", behavior: "smooth" }); return; }
    var products = clone(state.data.products);
    if (draftIndex >= 0) products[draftIndex] = out.product; else products.unshift(out.product);
    // Only send photos the product still uses, named after the product
    var uploads = [];
    out.product.images.forEach(function (img) {
      var up = draftUploads.filter(function (u) { return u.path === img.src; })[0];
      if (!up) return;
      var path = "images/products/" + out.product.id.slice(0, 50) + "-" + shortId() + ".jpg";
      previews[path] = previews[up.path];
      img.src = path;
      uploads.push({ path: path, base64: up.base64 });
    });
    btn.disabled = true;
    save({ products: { categories: state.data.categories, products: products }, uploads: uploads }).then(function () {
      dirty = false; closeEditor(true);
    }, function (err) {
      btn.disabled = false;
      if (err.code !== "changed_elsewhere" && err.code !== "signed_out") errorBox.textContent = errorText(err);
    });
  }

  function deleteProduct() {
    confirmBox(t("confirmDelete", { name: draft.name }), t("yesDelete"), t("keep"), true).then(function (ok) {
      if (!ok) return;
      var products = clone(state.data.products);
      products.splice(draftIndex, 1);
      save({ products: { categories: state.data.categories, products: products } }).then(function () { closeEditor(true); }, function () {});
    });
  }

  /* ---------- Shop settings and categories ---------- */
  function settingsPage() {
    var s = clone(state.data.settings);
    s.delivery = s.delivery || {};
    var errorBox = el("div", { className: "form-error big", role: "alert" });
    var feeText = s.delivery.deliveryFeeOMR === null || s.delivery.deliveryFeeOMR === undefined ? "" : Number(s.delivery.deliveryFeeOMR).toFixed(3);
    function input(key, obj, attrs) { obj = obj || s; return textInput(obj[key], function (x) { obj[key] = x; }, attrs); }
    function area(key, obj, attrs) { obj = obj || s; return textArea(obj[key], function (x) { obj[key] = x; }, attrs); }

    var saveBtn = el("button", { type: "button", className: "btn btn-primary", text: t("saveSettings"), onclick: function () {
      errorBox.textContent = "";
      var out = clone(s);
      var fee = feeText.trim() ? parsePrice(feeText) : null;
      if (fee !== null && isNaN(fee)) { errorBox.textContent = t("errPrice"); return; }
      out.delivery.deliveryFeeOMR = fee;
      out.whatsappNumber = String(out.whatsappNumber || "").replace(/[٠-٩]/g, function (d) { return String(d.charCodeAt(0) - 0x660); }).replace(/\D/g, "");
      if (!/^\d{8,15}$/.test(out.whatsappNumber)) { errorBox.textContent = t("errWhatsapp"); return; }
      if (!out.delivery.deliveryEnabled && !out.delivery.pickupEnabled) { errorBox.textContent = t("errDelivery"); return; }
      var q = parseInt(String(out.maxQuantityPerItem), 10);
      out.maxQuantityPerItem = isNaN(q) ? 10 : Math.max(1, Math.min(99, q));
      saveBtn.disabled = true;
      save({ settings: out }).then(function () { saveBtn.disabled = false; dirty = false; }, function (err) { saveBtn.disabled = false; errorBox.textContent = errorText(err); });
    } });

    return el("section", {}, [
      el("h1", { text: t("settingsTitle") }),
      el("section", { className: "card" }, [
        field(t("whatsapp"), input("whatsappNumber", s, { dir: "ltr", inputmode: "numeric" }), t("whatsappHint")),
        el("div", { className: "grid2" }, [
          field(t("instagram"), input("instagramUrl", s, { dir: "ltr", type: "url" })),
          field(t("instagramHandle"), input("instagramHandle", s, { dir: "ltr" }))
        ]),
        field(t("introAr"), area("intro")),
        field(t("introEn"), area("intro_en", s, { dir: "ltr" }))
      ]),
      el("section", { className: "card" }, [
        el("h2", { text: t("deliverySection") }),
        el("div", { className: "checks" }, [
          check(t("deliveryOn"), s.delivery.deliveryEnabled === true, function (on) { s.delivery.deliveryEnabled = on; }),
          check(t("pickupOn"), s.delivery.pickupEnabled === true, function (on) { s.delivery.pickupEnabled = on; })
        ]),
        field(t("deliveryFee"), textInput(feeText, function (x) { feeText = x; }, { dir: "ltr", inputmode: "decimal", placeholder: t("pricePh") }), t("deliveryFeeHint")),
        el("div", { className: "grid2" }, [
          field(t("deliveryNoteAr"), area("deliveryNote", s.delivery)),
          field(t("deliveryNoteEn"), area("deliveryNote_en", s.delivery, { dir: "ltr" }))
        ]),
        el("div", { className: "grid2" }, [
          field(t("pickupNoteAr"), area("pickupNote", s.delivery)),
          field(t("pickupNoteEn"), area("pickupNote_en", s.delivery, { dir: "ltr" }))
        ]),
        field(t("maxQty"), textInput(String(s.maxQuantityPerItem || 10), function (x) { s.maxQuantityPerItem = x; }, { dir: "ltr", inputmode: "numeric" }))
      ]),
      errorBox,
      el("div", { className: "save-bar" }, [saveBtn]),
      categoriesCard()
    ]);
  }

  function categoriesCard() {
    var cats = clone(state.data.categories);
    var errorBox = el("div", { className: "form-error", role: "alert" });
    var listNode = el("div", { className: "cats" });
    function used(id) { return state.data.products.some(function (p) { return p.category === id; }); }
    function draw() {
      listNode.innerHTML = "";
      cats.forEach(function (c, i) {
        listNode.appendChild(el("div", { className: "cat" }, [
          el("div", { className: "grid2" }, [
            field(t("catNameAr"), textInput(c.name, function (x) { c.name = x; })),
            field(t("catNameEn") + " (" + t("optional") + ")", textInput(c.name_en, function (x) { c.name_en = x; }, { dir: "ltr" }))
          ]),
          el("div", { className: "cat-actions" }, [
            el("button", { type: "button", className: "icon-btn", "aria-label": t("moveUp"), disabled: i === 0, onclick: function () { cats.splice(i - 1, 0, cats.splice(i, 1)[0]); dirty = true; draw(); } }, ["▲"]),
            el("button", { type: "button", className: "icon-btn", "aria-label": t("moveDown"), disabled: i === cats.length - 1, onclick: function () { cats.splice(i + 1, 0, cats.splice(i, 1)[0]); dirty = true; draw(); } }, ["▼"]),
            el("button", { type: "button", className: "link-btn danger", text: t("removeCategory"), onclick: function () {
              if (c.id && used(c.id)) { errorBox.textContent = t("catInUse"); return; }
              cats.splice(i, 1); dirty = true; draw();
            } })
          ])
        ]));
      });
    }
    draw();
    var saveBtn = el("button", { type: "button", className: "btn btn-primary", text: t("saveCategories"), onclick: function () {
      errorBox.textContent = "";
      var taken = {}; cats.forEach(function (c) { if (c.id) taken[c.id] = true; });
      var out = [];
      for (var i = 0; i < cats.length; i++) {
        var c = cats[i];
        var name = (c.name || "").trim();
        if (!name) { errorBox.textContent = t("errCatName"); return; }
        var o = { id: c.id || uniqueId(slug(c.name_en) || "category-" + shortId(), taken), name: name };
        if ((c.name_en || "").trim()) o.name_en = c.name_en.trim();
        out.push(o);
      }
      saveBtn.disabled = true;
      save({ products: { categories: out, products: state.data.products } }).then(function () {
        state.data.categories = out; saveBtn.disabled = false; dirty = false; render();
      }, function (err) { saveBtn.disabled = false; errorBox.textContent = errorText(err); });
    } });
    return el("section", { className: "card" }, [
      el("h2", { text: t("categoriesTitle") }),
      el("p", { className: "hint", text: t("categoriesHint") }),
      listNode,
      el("button", { type: "button", className: "btn btn-outline", onclick: function () { cats.push({ id: "", name: "", name_en: "" }); dirty = true; draw(); } }, ["+ " + t("addCategory")]),
      errorBox,
      el("div", { className: "save-bar" }, [saveBtn])
    ]);
  }

  /* ---------- Start ---------- */
  function loadData() {
    state.view = "loading"; render();
    api("GET", "/api/data").then(function (res) {
      state.data = { categories: res.products.categories || [], products: res.products.products || [], settings: res.settings };
      state.productsSha = res.productsSha; state.settingsSha = res.settingsSha;
      state.view = "main"; render();
    }, function (err) {
      if (err.code === "signed_out" || err.code === "not_configured") { setToken(""); state.view = "login"; render(); if (err.code !== "signed_out") status(errorText(err), "error"); return; }
      state.view = "loadfail"; render();
    });
  }

  if (getToken()) loadData(); else render();
})();
