/* =========================================================
   Sula Products — website text in Arabic and English.
   To change a wording, edit it here in both languages.
   Product text lives in data/products.json, not here.
   ========================================================= */
(function () {
  "use strict";

  var STORAGE_KEY = "sula-lang";

  var STRINGS = {
    ar: {
      "skip": "انتقلي إلى المحتوى",
      "nav.label": "القائمة الرئيسية",
      "nav.home": "الرئيسية",
      "nav.products": "المنتجات",
      "nav.cart": "السلة",
      "nav.items": " قطعة",
      "lang.button": "English",
      "lang.aria": "Switch to English",
      "footer.orders": "الطلبات عبر واتساب، ويؤكد المتجر التوفر والمبلغ النهائي قبل التجهيز.",
      "footer.instagram": "إنستغرام",

      "title.home": "Sula Products | مكياج وهدايا في عُمان",
      "desc.home": "Sula Products: كتالوج مكياج وهدايا في عُمان. تصفّحي المنتجات والألوان وأرسلي طلبك عبر واتساب.",
      "title.products": "المنتجات | Sula Products",
      "desc.products": "كل منتجات Sula Products من مكياج وهدايا، مع البحث والتصفية حسب القسم.",
      "title.product": "منتج | Sula Products",
      "desc.product": "تفاصيل المنتج والألوان المتوفرة والسعر من Sula Products.",
      "title.cart": "السلة | Sula Products",
      "desc.cart": "سلة التسوق وإرسال الطلب عبر واتساب إلى Sula Products.",
      "title.404": "الصفحة غير موجودة | Sula Products",
      "desc.404": "الصفحة غير موجودة.",

      "home.cta": "تسوّقي المنتجات",
      "home.ctaSecondary": "طريقة الطلب",
      "home.showcase": "منتجات Sula",
      "home.chip": "الطلب عبر واتساب",
      "home.categories": "الأقسام",
      "home.steps": "طريقة الطلب",
      "home.step1.title": "اختاري المنتج واللون",
      "home.step1.text": "تصفّحي المنتجات واختاري اللون والكمية.",
      "home.step2.title": "راجعي السلة",
      "home.step2.text": "عدّلي الكميات واكتبي بياناتك.",
      "home.step3.title": "أرسلي الطلب عبر واتساب",
      "home.step3.text": "نؤكد لك التوفر والمبلغ النهائي.",
      "home.featured": "منتجات مختارة",
      "home.viewAll": "عرض كل المنتجات",

      "count.1": "منتج واحد",
      "count.2": "منتجان",
      "count.few": "{n} منتجات",
      "count.many": "{n} منتجاً",

      "catalog.title": "المنتجات",
      "catalog.subtitle": "اختاري المنتج واللون، ثم أرسلي طلبك عبر واتساب.",
      "catalog.search": "ابحثي عن منتج أو لون",
      "catalog.placeholder": "مثال: أحمر شفاه، وردي",
      "catalog.filter": "تصفية حسب القسم",
      "catalog.all": "الكل",
      "catalog.count": "عدد المنتجات: {n}",
      "catalog.noResults": "لا توجد نتائج",
      "catalog.empty": "لا توجد منتجات مطابقة لبحثك.",
      "catalog.showAll": "عرض كل المنتجات",

      "card.sample": "تجريبي",
      "card.out": "غير متوفر",
      "card.noPrice": "السعر غير متوفر",
      "card.options": "{n} خيارات",
      "card.choose": "اختاري {label}",
      "card.view": "عرض المنتج",
      "card.addAria": "أضيفي {item} إلى السلة",
      "card.added": "✓ تمت الإضافة",
      "price.from": "من ",

      "crumb.label": "مسار التصفح",
      "product.notFound": "المنتج غير موجود",
      "product.notFoundText": "ربما تمت إزالة هذا المنتج أو تغيّر رابطه.",
      "product.sampleNote": "منتج تجريبي للعرض فقط، وليس من مخزون المتجر.",
      "product.photos": "صور المنتج",
      "product.showPhoto": "عرض الصورة {i} من {n}",
      "product.optionDefault": "اللون",
      "product.unavailableSuffix": " (غير متوفر)",
      "product.notChosen": "لم يتم الاختيار",
      "product.qty": "الكمية",
      "product.qtyDown": "إنقاص الكمية",
      "product.qtyUp": "زيادة الكمية",
      "product.add": "أضيفي إلى السلة",
      "product.outOfStock": "غير متوفر حالياً",
      "product.inStock": "متوفر",
      "product.choosePrompt": "اختاري {label} لمعرفة التوفر.",
      "product.chooseFirst": "يرجى اختيار {label} أولاً.",
      "product.optionOut": "هذا الخيار غير متوفر حالياً.",
      "product.added": "تمت إضافة «{item}» إلى السلة. ",
      "product.addedCapped": "تمت الإضافة. الحد الأقصى {max} قطع لهذا الخيار. ",
      "product.viewCart": "عرض السلة",
      "toast.added": "أُضيف إلى السلة: {item}",

      "notice.sampleLabel": "تنبيه: ",
      "notice.sample": "المنتجات المعروضة حالياً أمثلة تجريبية لتجربة الموقع، وليست مخزوناً فعلياً للمتجر.",
      "notice.cartUpdated": "تم تحديث سلتك حسب آخر الأسعار والتوفر:",
      "notice.gone": "لم يعد «{item}» موجوداً في المتجر، فتمت إزالته من السلة.",
      "notice.unavailable": "«{item}» غير متوفر حالياً، فتمت إزالته من السلة.",
      "notice.price": "تغيّر سعر «{item}» من {old} إلى {new}، والسلة تعرض السعر الحالي.",
      "notice.max": "الحد الأقصى لـ«{item}» هو {max} قطع في الطلب الواحد، فتم تعديل الكمية.",
      "notice.unknownItem": "منتج",
      "load.error": "تعذّر تحميل المنتجات. ",
      "load.retry": "حدّثي الصفحة أو حاولي لاحقاً.",
      "load.file": "ملاحظة للمسؤولة: افتحي الموقع عبر خادم محلي (مثل python -m http.server) وليس بالنقر المزدوج على الملف، لأن المتصفح يمنع قراءة ملفات JSON بهذه الطريقة.",

      "cart.title": "السلة",
      "cart.emptyTitle": "سلتك فارغة",
      "cart.emptyText": "أضيفي منتجات من الكتالوج، وستظهر هنا.",
      "cart.list": "المنتجات في السلة",
      "cart.summary": "ملخص الطلب",
      "cart.subtotal": "مجموع المنتجات",
      "cart.deliveryFee": "رسوم التوصيل (عند اختيار التوصيل)",
      "cart.productsOnly": "المبلغ أعلاه للمنتجات فقط. ",
      "cart.storeConfirms": "يؤكد المتجر التوفر والمبلغ النهائي عبر واتساب قبل تجهيز الطلب.",
      "cart.unitPrice": "سعر القطعة: ",
      "cart.qtyOf": "كمية {item}",
      "cart.qtyUp": "زيادة كمية {item}",
      "cart.qtyDown": "إنقاص كمية {item}",
      "cart.remove": "إزالة",
      "cart.removeAria": "إزالة {item} من السلة",
      "cart.removed": "تمت إزالة «{item}» من السلة.",

      "form.title": "بيانات الطلب",
      "form.waOff": "الطلب عبر واتساب غير مفعّل بعد. ",
      "form.waInvalid": "رقم واتساب المتجر في ملف الإعدادات غير صحيح. يجب أن يكون أرقاماً فقط مع رمز الدولة، مثل 968XXXXXXXX.",
      "form.waMissing": "يجب إضافة رقم واتساب المتجر في ملف data/settings.json (الحقل whatsappNumber) قبل استقبال الطلبات.",
      "form.name": "الاسم",
      "form.phone": "رقم الهاتف",
      "form.phoneHint": "مثال: 9XXXXXXX أو ‎+968 9XXXXXXX",
      "form.area": "المنطقة / الولاية",
      "form.areaHint": "مثال: مسقط، السيب",
      "form.method": "طريقة الاستلام",
      "form.delivery": "توصيل",
      "form.pickup": "استلام من المتجر",
      "form.notes": "ملاحظات",
      "form.optional": " (اختياري)",
      "form.explain": "عند الضغط سيُفتح واتساب برسالة جاهزة تحتوي طلبك. الطلب لا يُرسل حتى تضغطي زر الإرسال داخل واتساب، ثم يؤكد المتجر التوفر والمبلغ النهائي.",
      "form.submit": "إرسال الطلب عبر واتساب",
      "form.nameError": "يرجى كتابة الاسم.",
      "form.phoneError": "يرجى كتابة رقم الهاتف.",
      "form.phoneInvalid": "رقم الهاتف غير صحيح. اكتبي رقماً عُمانياً من 8 أرقام يبدأ بـ 7 أو 9، أو رقماً دولياً يبدأ بـ +.",
      "form.areaError": "يرجى كتابة المنطقة أو الولاية.",
      "form.methodError": "يرجى اختيار التوصيل أو الاستلام.",
      "handoff.title": "خطوة أخيرة داخل واتساب",
      "handoff.text": "طلبك لم يُرسل بعد. اضغطي زر الإرسال في واتساب لإرسال الرسالة إلى المتجر. سيؤكد لك المتجر التوفر والمبلغ النهائي.",
      "handoff.fallback": "إذا لم يفتح واتساب تلقائياً، ",
      "handoff.link": "اضغطي هنا لفتحه",
      "handoff.saved": "سلتك محفوظة في هذا الجهاز إذا احتجتِ للعودة وتعديل الطلب.",

      "msg.header": "طلب جديد من موقع {brand}",
      "msg.unconfirmed": "(طلب غير مؤكد، بانتظار تأكيد المتجر للتوفر والمبلغ النهائي)",
      "msg.products": "المنتجات:",
      "msg.productId": "رمز المنتج: ",
      "msg.variantId": "رمز الخيار: ",
      "msg.qty": "الكمية: ",
      "msg.subtotal": "مجموع المنتجات: ",
      "msg.deliveryFee": "رسوم التوصيل: ",
      "msg.estTotal": "الإجمالي التقديري: ",
      "msg.deliveryTbc": "رسوم التوصيل: تُؤكَّد عبر واتساب",
      "msg.customer": "بيانات العميل:",
      "msg.name": "الاسم: ",
      "msg.phone": "الهاتف: ",
      "msg.area": "المنطقة: ",
      "msg.method": "طريقة الاستلام: ",
      "msg.notes": "ملاحظات: ",
      "msg.none": "لا يوجد",

      "404.title": "الصفحة غير موجودة",
      "404.text": "ربما تغيّر الرابط. يمكنك العودة إلى المنتجات."
    },

    en: {
      "skip": "Skip to content",
      "nav.label": "Main menu",
      "nav.home": "Home",
      "nav.products": "Products",
      "nav.cart": "Cart",
      "nav.items": " items",
      "lang.button": "العربية",
      "lang.aria": "التبديل إلى العربية",
      "footer.orders": "Orders are placed on WhatsApp. The store confirms availability and the final total before preparing your order.",
      "footer.instagram": "Instagram",

      "title.home": "Sula Products | Makeup and gifts in Oman",
      "desc.home": "Sula Products: a makeup and gifts catalog in Oman. Browse products and shades, then send your order on WhatsApp.",
      "title.products": "Products | Sula Products",
      "desc.products": "All Sula Products makeup and gifts, with search and category filters.",
      "title.product": "Product | Sula Products",
      "desc.product": "Product details, available shades and price from Sula Products.",
      "title.cart": "Cart | Sula Products",
      "desc.cart": "Your cart and WhatsApp order for Sula Products.",
      "title.404": "Page not found | Sula Products",
      "desc.404": "Page not found.",

      "home.cta": "Shop products",
      "home.ctaSecondary": "How to order",
      "home.showcase": "Sula products",
      "home.chip": "Order on WhatsApp",
      "home.categories": "Categories",
      "home.steps": "How to order",
      "home.step1.title": "Pick a product and shade",
      "home.step1.text": "Browse the products, then choose a shade and quantity.",
      "home.step2.title": "Review your cart",
      "home.step2.text": "Adjust quantities and add your details.",
      "home.step3.title": "Send the order on WhatsApp",
      "home.step3.text": "We confirm availability and the final total.",
      "home.featured": "Featured products",
      "home.viewAll": "View all products",

      "count.1": "1 product",
      "count.2": "2 products",
      "count.few": "{n} products",
      "count.many": "{n} products",

      "catalog.title": "Products",
      "catalog.subtitle": "Pick a product and shade, then send your order on WhatsApp.",
      "catalog.search": "Search for a product or shade",
      "catalog.placeholder": "e.g. lipstick, pink",
      "catalog.filter": "Filter by category",
      "catalog.all": "All",
      "catalog.count": "{n} products",
      "catalog.noResults": "No results",
      "catalog.empty": "No products match your search.",
      "catalog.showAll": "Show all products",

      "card.sample": "Sample",
      "card.out": "Unavailable",
      "card.noPrice": "Price unavailable",
      "card.options": "{n} options",
      "card.choose": "Choose a {label}",
      "card.view": "View product",
      "card.addAria": "Add {item} to cart",
      "card.added": "✓ Added",
      "price.from": "From ",

      "crumb.label": "Breadcrumb",
      "product.notFound": "Product not found",
      "product.notFoundText": "This product may have been removed or its link changed.",
      "product.sampleNote": "Sample product for display only. It is not store stock.",
      "product.photos": "Product photos",
      "product.showPhoto": "Show photo {i} of {n}",
      "product.optionDefault": "Shade",
      "product.unavailableSuffix": " (unavailable)",
      "product.notChosen": "not selected",
      "product.qty": "Quantity",
      "product.qtyDown": "Decrease quantity",
      "product.qtyUp": "Increase quantity",
      "product.add": "Add to cart",
      "product.outOfStock": "Currently unavailable",
      "product.inStock": "In stock",
      "product.choosePrompt": "Choose a {label} to see availability.",
      "product.chooseFirst": "Please choose a {label} first.",
      "product.optionOut": "This option is currently unavailable.",
      "product.added": "Added “{item}” to your cart. ",
      "product.addedCapped": "Added. The limit is {max} per option. ",
      "product.viewCart": "View cart",
      "toast.added": "Added to cart: {item}",

      "notice.sampleLabel": "Note: ",
      "notice.sample": "The products shown are samples for testing the website. They are not real store stock.",
      "notice.cartUpdated": "Your cart was updated to the latest prices and availability:",
      "notice.gone": "“{item}” is no longer in the store and was removed from your cart.",
      "notice.unavailable": "“{item}” is currently unavailable and was removed from your cart.",
      "notice.price": "The price of “{item}” changed from {old} to {new}. Your cart shows the current price.",
      "notice.max": "The limit for “{item}” is {max} per order, so the quantity was adjusted.",
      "notice.unknownItem": "Item",
      "load.error": "Products could not be loaded. ",
      "load.retry": "Refresh the page or try again later.",
      "load.file": "Note for the site owner: open the site through a local server (for example python -m http.server), not by double-clicking the file. Browsers block JSON files opened that way.",

      "cart.title": "Your cart",
      "cart.emptyTitle": "Your cart is empty",
      "cart.emptyText": "Add products from the catalog and they will appear here.",
      "cart.list": "Products in your cart",
      "cart.summary": "Order summary",
      "cart.subtotal": "Products subtotal",
      "cart.deliveryFee": "Delivery fee (if you choose delivery)",
      "cart.productsOnly": "This amount covers products only. ",
      "cart.storeConfirms": "The store confirms availability and the final total on WhatsApp before preparing your order.",
      "cart.unitPrice": "Unit price: ",
      "cart.qtyOf": "Quantity of {item}",
      "cart.qtyUp": "Increase quantity of {item}",
      "cart.qtyDown": "Decrease quantity of {item}",
      "cart.remove": "Remove",
      "cart.removeAria": "Remove {item} from cart",
      "cart.removed": "Removed “{item}” from your cart.",

      "form.title": "Your details",
      "form.waOff": "WhatsApp ordering is not set up yet. ",
      "form.waInvalid": "The store WhatsApp number in the settings file is not valid. Use digits only with the country code, like 968XXXXXXXX.",
      "form.waMissing": "Add the store WhatsApp number in data/settings.json (the whatsappNumber field) before taking orders.",
      "form.name": "Name",
      "form.phone": "Phone number",
      "form.phoneHint": "e.g. 9XXXXXXX or +968 9XXXXXXX",
      "form.area": "Area / Wilayat",
      "form.areaHint": "e.g. Muscat, Seeb",
      "form.method": "Delivery or pickup",
      "form.delivery": "Delivery",
      "form.pickup": "Pickup from the store",
      "form.notes": "Notes",
      "form.optional": " (optional)",
      "form.explain": "This opens WhatsApp with your order written out. The order is not sent until you press send in WhatsApp. The store then confirms availability and the final total.",
      "form.submit": "Send order via WhatsApp",
      "form.nameError": "Please enter your name.",
      "form.phoneError": "Please enter your phone number.",
      "form.phoneInvalid": "This phone number doesn't look right. Enter an 8-digit Omani number starting with 7 or 9, or an international number starting with +.",
      "form.areaError": "Please enter your area or wilayat.",
      "form.methodError": "Please choose delivery or pickup.",
      "handoff.title": "One last step in WhatsApp",
      "handoff.text": "Your order has not been sent yet. Press send in WhatsApp to send the message to the store. The store will confirm availability and the final total.",
      "handoff.fallback": "If WhatsApp didn't open, ",
      "handoff.link": "tap here to open it",
      "handoff.saved": "Your cart is saved on this device in case you need to come back and change your order.",

      "msg.header": "New order from the {brand} website",
      "msg.unconfirmed": "(Not confirmed yet. Waiting for the store to confirm availability and the final total.)",
      "msg.products": "Products:",
      "msg.productId": "Product ID: ",
      "msg.variantId": "Option ID: ",
      "msg.qty": "Quantity: ",
      "msg.subtotal": "Products subtotal: ",
      "msg.deliveryFee": "Delivery fee: ",
      "msg.estTotal": "Estimated total: ",
      "msg.deliveryTbc": "Delivery fee: to be confirmed on WhatsApp",
      "msg.customer": "Customer details:",
      "msg.name": "Name: ",
      "msg.phone": "Phone: ",
      "msg.area": "Area: ",
      "msg.method": "Delivery or pickup: ",
      "msg.notes": "Notes: ",
      "msg.none": "None",

      "404.title": "Page not found",
      "404.text": "The link may have changed. You can go back to the products."
    }
  };

  // Language comes from the link (?lang=en) first, then from the visitor's last choice.
  var lang = "ar";
  var fromUrl = new URLSearchParams(window.location.search).get("lang");
  try {
    if (fromUrl === "en" || fromUrl === "ar") window.localStorage.setItem(STORAGE_KEY, fromUrl);
    if (window.localStorage.getItem(STORAGE_KEY) === "en") lang = "en";
  } catch (e) { /* storage blocked */ }
  if (fromUrl === "en" || fromUrl === "ar") lang = fromUrl;

  // t("product.chooseFirst", { label: "Shade" })
  function t(key, vars) {
    var text = STRINGS[lang][key];
    if (text === undefined) text = STRINGS.ar[key];
    if (text === undefined) return key;
    if (vars) {
      text = text.replace(/\{(\w+)\}/g, function (match, name) {
        return vars[name] !== undefined ? String(vars[name]) : match;
      });
    }
    return text;
  }

  // Picks the English field (for example name_en) when the site is in English
  // and that field is filled in; otherwise uses the Arabic field.
  function pick(obj, field) {
    if (!obj) return "";
    if (lang === "en" && typeof obj[field + "_en"] === "string" && obj[field + "_en"].trim()) return obj[field + "_en"];
    return obj[field];
  }

  function countText(n) {
    if (n === 1) return t("count.1");
    if (n === 2) return t("count.2");
    return t(n <= 10 ? "count.few" : "count.many", { n: n });
  }

  // Fills every element marked with data-i18n="key" or data-i18n-attr="attribute:key"
  function applyStatic() {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "en" ? "ltr" : "rtl";
    document.querySelectorAll("[data-i18n]").forEach(function (node) {
      node.textContent = t(node.getAttribute("data-i18n"));
    });
    document.querySelectorAll("[data-i18n-attr]").forEach(function (node) {
      node.getAttribute("data-i18n-attr").split(";").forEach(function (pair) {
        var parts = pair.split(":");
        if (parts.length === 2) node.setAttribute(parts[0].trim(), t(parts[1].trim()));
      });
    });
    document.querySelectorAll("[data-lang-toggle]").forEach(function (button) {
      button.setAttribute("lang", lang === "en" ? "ar" : "en");
      button.addEventListener("click", function () {
        setLang(lang === "en" ? "ar" : "en");
      });
    });
  }

  function setLang(next) {
    try { window.localStorage.setItem(STORAGE_KEY, next); } catch (e) { /* ignore */ }
    // Reload the same page (and product) in the new language. The cart is kept.
    var params = new URLSearchParams(window.location.search);
    params.set("lang", next);
    window.location.search = params.toString();
  }

  window.I18n = { lang: lang, t: t, pick: pick, countText: countText, setLang: setLang };
  applyStatic();
})();
