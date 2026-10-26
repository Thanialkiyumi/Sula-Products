/* Cart page: edit quantities, remove items, checkout form, WhatsApp message. */
(function () {
  "use strict";
  var S = window.Sula;
  var el = S.el;
  var t = S.t;
  var DRAFT_KEY = "sula-checkout-v1";

  S.boot().then(function (data) {
    var settings = data.settings, catalog = data.catalog, cart = data.cart;
    var root = document.getElementById("cart-root");

    // Saved form details, so the customer does not retype them after visiting WhatsApp.
    var draft = {};
    try { draft = JSON.parse(S.storageGet(DRAFT_KEY) || "{}") || {}; } catch (e) { draft = {}; }

    var fulfillmentOptions = [];
    if (settings.deliveryEnabled) fulfillmentOptions.push({ value: "delivery", label: t("form.delivery"), note: settings.deliveryNote });
    if (settings.pickupEnabled) fulfillmentOptions.push({ value: "pickup", label: t("form.pickup"), note: settings.pickupNote });
    if (!fulfillmentOptions.length) fulfillmentOptions.push({ value: "delivery", label: t("form.delivery"), note: settings.deliveryNote });

    var firstRender = true;
    function render() {
      root.textContent = "";
      setTimeout(function () { firstRender = false; }, 0);
      if (!cart.length) {
        root.appendChild(el("div", { className: "empty-state" }, [
          el("h2", { text: t("cart.emptyTitle") }),
          el("p", { className: "muted", text: t("cart.emptyText") }),
          el("a", { className: "btn btn-primary", href: "products.html", text: t("home.cta") })
        ]));
        return;
      }

      var lines = S.cartLines(cart, catalog);
      var subtotal = S.subtotalBaisa(lines);

      var list = el("ul", { className: "cart-list", "aria-label": t("cart.list") }, lines.map(lineItem));

      var summary = el("section", { className: "summary", "aria-labelledby": "summary-title" }, [
        el("h2", { id: "summary-title", text: t("cart.summary") }),
        el("div", { className: "summary-row total" }, [el("span", { text: t("cart.subtotal") }), S.priceEl(subtotal)]),
        settings.deliveryFeeBaisa !== null && settings.deliveryEnabled
          ? el("div", { className: "summary-row" }, [el("span", { text: t("cart.deliveryFee") }), S.priceEl(settings.deliveryFeeBaisa)])
          : el("p", { className: "note", text: t("cart.productsOnly") + settings.deliveryNote }),
        el("p", { className: "note", text: t("cart.storeConfirms") })
      ]);

      root.appendChild(el("div", { className: "cart-layout" + (firstRender ? " rise" : "") }, [
        el("div", null, [list]),
        el("div", { className: "cart-side" }, [summary, checkoutForm(lines, subtotal)])
      ]));
    }

    function lineItem(line) {
      var p = line.product, v = line.variant, item = line.item;
      var label = S.itemLabel(p.name, v.shade);

      function setQty(n) {
        item.qty = Math.max(1, Math.min(settings.maxQty, n));
        S.writeCart(cart);
        render();
        var again = document.getElementById("qty-" + v.id);
        if (again) again.focus();
      }

      var qtyInput = el("input", {
        type: "number", id: "qty-" + v.id, inputmode: "numeric",
        min: 1, max: settings.maxQty, value: item.qty,
        "aria-label": t("cart.qtyOf", { item: label })
      });
      qtyInput.addEventListener("change", function () {
        var n = parseInt(S.toLatinDigits(qtyInput.value), 10);
        setQty(n >= 1 ? n : 1);
      });

      return el("li", { className: "cart-item" }, [
        el("a", { href: S.productUrl(p), tabindex: "-1", "aria-hidden": "true" }, [S.imageEl({ src: p.images[0].src, alt: "" }, { width: 168, height: 168 })]),
        el("div", { className: "details" }, [
          el("h3", null, [el("a", { href: S.productUrl(p), text: p.name })]),
          el("p", { className: "line-meta" }, [
            v.shade ? p.optionLabel + ": " + v.shade + " · " : "",
            t("cart.unitPrice"), S.priceEl(v.priceBaisa)
          ]),
          el("div", { className: "line-actions" }, [
            el("div", { className: "qty" }, [
              el("button", { type: "button", "aria-label": t("cart.qtyUp", { item: label }), text: "+", disabled: item.qty >= settings.maxQty, onclick: function () { setQty(item.qty + 1); } }),
              qtyInput,
              el("button", { type: "button", "aria-label": t("cart.qtyDown", { item: label }), text: "−", disabled: item.qty <= 1, onclick: function () { setQty(item.qty - 1); } })
            ]),
            S.priceEl(line.lineBaisa, "strong")
          ]),
          el("div", null, [
            el("button", {
              type: "button", className: "btn-link", text: t("cart.remove"),
              "aria-label": t("cart.removeAria", { item: label }),
              onclick: function (e) {
                var row = e.currentTarget.closest(".cart-item");
                cart.splice(cart.indexOf(item), 1);
                S.writeCart(cart);
                announce(t("cart.removed", { item: label }));
                // Slide the row out, then redraw the cart
                row.classList.add("is-removing");
                setTimeout(render, 260);
              }
            })
          ])
        ])
      ]);
    }

    var liveRegion = el("p", { className: "visually-hidden", role: "status", "aria-live": "polite" });
    root.parentNode.insertBefore(liveRegion, root);
    function announce(text) { liveRegion.textContent = text; }

    /* ---------- Checkout form ---------- */

    function field(id, labelText, input, options) {
      options = options || {};
      var error = el("p", { className: "field-error", id: id + "-error", hidden: true });
      input.setAttribute("aria-describedby", (options.hint ? id + "-hint " : "") + id + "-error");
      return el("div", { className: "field" }, [
        el("label", { for: id }, [labelText, options.optional ? el("span", { className: "optional", text: t("form.optional") }) : null]),
        options.hint ? el("p", { className: "hint", id: id + "-hint", text: options.hint }) : null,
        input,
        error
      ]);
    }

    function checkoutForm(lines, subtotal) {
      var nameInput = el("input", { type: "text", id: "c-name", name: "name", autocomplete: "name", maxlength: 60, required: true, value: draft.name || "" });
      var phoneInput = el("input", { type: "tel", id: "c-phone", name: "phone", autocomplete: "tel", inputmode: "tel", maxlength: 20, required: true, dir: "ltr", value: draft.phone || "" });
      var areaInput = el("input", { type: "text", id: "c-area", name: "area", autocomplete: "address-level2", list: "area-list", maxlength: 80, required: true, value: draft.area || "" });
      var areaList = el("datalist", { id: "area-list" }, settings.areas.map(function (a) { return el("option", { value: a }); }));
      var notesInput = el("textarea", { id: "c-notes", name: "notes", maxlength: 500, rows: 3 });
      notesInput.value = draft.notes || "";

      var savedChoice = fulfillmentOptions.some(function (o) { return o.value === draft.fulfillment; }) ? draft.fulfillment : null;
      if (fulfillmentOptions.length === 1) savedChoice = fulfillmentOptions[0].value;
      var fulfillmentError = el("p", { className: "field-error", id: "c-fulfillment-error", hidden: true });
      var fulfillmentNote = el("p", { className: "hint", id: "c-fulfillment-note" });
      var fulfillmentSet = el("fieldset", { className: "field", "aria-describedby": "c-fulfillment-note c-fulfillment-error" }, [
        el("legend", { text: t("form.method") }),
        el("div", { className: "radio-group" }, fulfillmentOptions.map(function (o) {
          return el("label", null, [
            el("input", { type: "radio", name: "fulfillment", value: o.value, checked: savedChoice === o.value, required: true }),
            o.label
          ]);
        })),
        fulfillmentNote,
        fulfillmentError
      ]);

      function currentFulfillment() {
        var checked = fulfillmentSet.querySelector("input:checked");
        return checked ? checked.value : null;
      }
      function updateFulfillmentNote() {
        var choice = fulfillmentOptions.find(function (o) { return o.value === currentFulfillment(); });
        fulfillmentNote.textContent = choice ? choice.note : "";
      }
      updateFulfillmentNote();

      var whatsappOk = settings.whatsapp.ok;
      var submitBtn = el("button", { type: "submit", className: "btn btn-whatsapp", text: t("form.submit"), disabled: !whatsappOk });
      var handoff = el("div", { className: "handoff", role: "status", tabindex: "-1", hidden: true });

      var form = el("form", { className: "checkout", novalidate: true, "aria-labelledby": "checkout-title" }, [
        el("h2", { id: "checkout-title", text: t("form.title") }),
        whatsappOk ? null : el("div", { className: "notice notice-warn", role: "note" }, [
          el("strong", { text: t("form.waOff") }),
          settings.whatsapp.problem === "invalid"
            ? t("form.waInvalid")
            : t("form.waMissing")
        ]),
        field("c-name", t("form.name"), nameInput),
        field("c-phone", t("form.phone"), phoneInput, { hint: t("form.phoneHint") }),
        field("c-area", t("form.area"), areaInput, { hint: t("form.areaHint") }),
        areaList,
        fulfillmentSet,
        field("c-notes", t("form.notes"), notesInput, { optional: true }),
        el("p", { className: "checkout-explain", text: t("form.explain") }),
        submitBtn,
        handoff
      ]);

      // Save the form as the customer types
      form.addEventListener("input", saveDraft);
      form.addEventListener("change", function (e) {
        if (e.target.name === "fulfillment") { updateFulfillmentNote(); clearError(fulfillmentSet, fulfillmentError); }
        saveDraft();
      });
      function saveDraft() {
        draft = { name: nameInput.value, phone: phoneInput.value, area: areaInput.value, notes: notesInput.value, fulfillment: currentFulfillment() };
        S.storageSet(DRAFT_KEY, JSON.stringify(draft));
      }

      function setError(input, errorNode, message) {
        errorNode.textContent = message;
        errorNode.hidden = false;
        input.setAttribute("aria-invalid", "true");
      }
      function clearError(input, errorNode) {
        errorNode.hidden = true;
        errorNode.textContent = "";
        input.removeAttribute("aria-invalid");
      }

      [nameInput, phoneInput, areaInput].forEach(function (input) {
        input.addEventListener("input", function () { clearError(input, document.getElementById(input.id + "-error")); });
      });

      form.addEventListener("submit", function (e) {
        e.preventDefault();
        if (!whatsappOk) return;

        var firstInvalid = null;
        function fail(input, errorNode, message) {
          setError(input, errorNode, message);
          if (!firstInvalid) firstInvalid = input;
        }

        var name = nameInput.value.trim();
        var phone = normalizePhone(phoneInput.value);
        var area = areaInput.value.trim();
        var fulfillment = currentFulfillment();

        clearError(nameInput, document.getElementById("c-name-error"));
        clearError(phoneInput, document.getElementById("c-phone-error"));
        clearError(areaInput, document.getElementById("c-area-error"));
        clearError(fulfillmentSet, fulfillmentError);

        if (name.length < 2) fail(nameInput, document.getElementById("c-name-error"), t("form.nameError"));
        if (!phoneInput.value.trim()) fail(phoneInput, document.getElementById("c-phone-error"), t("form.phoneError"));
        else if (!phone) fail(phoneInput, document.getElementById("c-phone-error"), t("form.phoneInvalid"));
        if (!area) fail(areaInput, document.getElementById("c-area-error"), t("form.areaError"));
        if (!fulfillment) {
          fail(fulfillmentSet, fulfillmentError, t("form.methodError"));
          if (firstInvalid === fulfillmentSet) firstInvalid = fulfillmentSet.querySelector("input");
        }

        if (firstInvalid) { firstInvalid.focus(); return; }

        var message = buildMessage(S.cartLines(cart, catalog), {
          name: name, phone: phone, area: area,
          fulfillment: fulfillment,
          notes: notesInput.value.trim()
        });
        var url = "https://wa.me/" + settings.whatsapp.number + "?text=" + encodeURIComponent(message);

        // The cart is kept. Opening WhatsApp is NOT a confirmed order.
        handoff.textContent = "";
        handoff.appendChild(el("h2", { text: t("handoff.title") }));
        handoff.appendChild(el("p", { text: t("handoff.text") }));
        handoff.appendChild(el("p", null, [t("handoff.fallback"), el("a", { href: url, target: "_blank", rel: "noopener", text: t("handoff.link") }), "."]));
        handoff.appendChild(el("p", { text: t("handoff.saved") }));
        handoff.hidden = false;
        handoff.focus();

        window.location.href = url;
      });

      return form;
    }

    // Returns a cleaned phone number, or "" when it does not look valid.
    function normalizePhone(value) {
      var v = S.toLatinDigits(value).replace(/[\s\-().]/g, "");
      if (/^00/.test(v)) v = "+" + v.slice(2);
      if (/^[79]\d{7}$/.test(v)) return "+968" + v;                // Omani mobile, 8 digits
      if (/^\+968[79]\d{7}$/.test(v)) return v;
      if (/^968[79]\d{7}$/.test(v)) return "+" + v;
      if (/^\+(?!968)\d{8,15}$/.test(v)) return v;                  // other countries
      return "";
    }

    function buildMessage(lines, customer) {
      var subtotal = S.subtotalBaisa(lines);
      var out = [];
      out.push(t("msg.header", { brand: settings.brandName }));
      out.push(t("msg.unconfirmed"));
      out.push("");
      out.push(t("msg.products"));
      lines.forEach(function (line, i) {
        var p = line.product, v = line.variant;
        out.push((i + 1) + ") " + p.name);
        if (v.shade) out.push("   " + p.optionLabel + ": " + v.shade);
        out.push("   " + t("msg.productId") + p.id);
        out.push("   " + t("msg.variantId") + v.id);
        out.push("   " + t("msg.qty") + line.item.qty + " × " + S.formatBaisa(v.priceBaisa) + " = " + S.formatBaisa(line.lineBaisa));
      });
      out.push("");
      out.push(t("msg.subtotal") + S.formatBaisa(subtotal));

      var isDelivery = customer.fulfillment === "delivery";
      if (isDelivery && settings.deliveryFeeBaisa !== null) {
        out.push(t("msg.deliveryFee") + S.formatBaisa(settings.deliveryFeeBaisa));
        out.push(t("msg.estTotal") + S.formatBaisa(subtotal + settings.deliveryFeeBaisa));
      } else if (isDelivery) {
        out.push(t("msg.deliveryTbc"));
      }
      out.push("");
      out.push(t("msg.customer"));
      out.push(t("msg.name") + customer.name);
      out.push(t("msg.phone") + customer.phone);
      out.push(t("msg.area") + customer.area);
      out.push(t("msg.method") + (isDelivery ? t("form.delivery") : t("form.pickup")));
      out.push(t("msg.notes") + (customer.notes || t("msg.none")));
      return out.join("\n");
    }

    render();
  }).catch(function () {});
})();
