/* Product details page: product.html?id=PRODUCT_ID */
(function () {
  "use strict";
  var S = window.Sula;
  var el = S.el;
  var t = S.t;

  S.boot().then(function (data) {
    var settings = data.settings, catalog = data.catalog, cart = data.cart;
    var root = document.getElementById("product-root");
    var id = new URLSearchParams(location.search).get("id");
    var product = id ? catalog.byProduct[id] : null;

    if (!product) {
      document.getElementById("crumb-name").textContent = t("product.notFound");
      root.appendChild(el("div", { className: "empty-state" }, [
        el("h1", { text: t("product.notFound") }),
        el("p", { text: t("product.notFoundText") }),
        el("a", { className: "btn btn-primary", href: "products.html", text: t("home.cta") })
      ]));
      return;
    }

    document.title = product.name + " | " + settings.brandName;
    document.getElementById("crumb-name").textContent = product.name;
    var metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc && product.description) metaDesc.setAttribute("content", product.description);

    // If there is exactly one variant without a shade, it is selected automatically.
    var selected = product.hasOptions ? null : product.variants[0];
    // If only one shade is available, pre-select it to save a tap.
    var availableVariants = product.variants.filter(function (v) { return v.available; });
    if (product.hasOptions && availableVariants.length === 1) selected = availableVariants[0];

    /* ----- Gallery ----- */
    var mainImg = S.imageEl(product.images[0], { loading: "eager", fetchpriority: "high" });
    var gallery = el("div", { className: "gallery" }, [el("div", { className: "gallery-main" }, [mainImg])]);
    if (product.images.length > 1) {
      var thumbs = el("div", { className: "gallery-thumbs", role: "group", "aria-label": t("product.photos") });
      product.images.forEach(function (img, i) {
        var btn = el("button", {
          type: "button",
          "aria-label": t("product.showPhoto", { i: i + 1, n: product.images.length }),
          "aria-current": i === 0 ? "true" : "false",
          onclick: function () {
            if (mainImg.getAttribute("src") === img.src) return;
            // Fade out, swap the photo, fade back in once it has loaded
            mainImg.classList.add("is-swapping");
            setTimeout(function () {
              mainImg.addEventListener("load", function shown() {
                mainImg.removeEventListener("load", shown);
                mainImg.classList.remove("is-swapping");
              });
              mainImg.src = img.src;
              mainImg.alt = img.alt;
              if (mainImg.complete) mainImg.classList.remove("is-swapping");
            }, 180);
            thumbs.querySelectorAll("button").forEach(function (b) { b.setAttribute("aria-current", "false"); });
            btn.setAttribute("aria-current", "true");
          }
        }, [S.imageEl({ src: img.src, alt: "" }, { width: 136, height: 136 })]);
        thumbs.appendChild(btn);
      });
      gallery.appendChild(thumbs);
    }

    /* ----- Info ----- */
    var priceNode = el("p", { className: "product-price" });
    var availabilityNode = el("p", { className: "availability", role: "status" });
    var shadeError = el("p", { className: "field-error", id: "shade-error", hidden: true });
    var statusMsg = el("p", { className: "status-msg", role: "status", "aria-live": "polite" });

    var info = el("div", { className: "product-info" }, [
      product.sample ? el("p", { className: "notice notice-sample", text: t("product.sampleNote") }) : null,
      el("div", null, [
        product.categoryName ? el("p", { className: "muted", text: product.categoryName }) : null,
        el("h1", { text: product.name })
      ]),
      priceNode,
      product.description ? el("p", { className: "product-desc", text: product.description }) : null
    ]);

    /* Shade / option picker (radio buttons, keyboard friendly) */
    // Lower-case "shade" in English sentences ("Please choose a shade first")
    var labelInSentence = S.lang === "en" ? product.optionLabel.toLowerCase() : product.optionLabel;
    var shadeFieldset = null;
    var selectedName = el("span", { className: "muted" });
    if (product.hasOptions) {
      shadeFieldset = el("fieldset", { className: "field", "aria-describedby": "shade-error" }, [
        el("legend", null, [product.optionLabel + ": ", selectedName]),
        el("div", { className: "shade-options" }, product.variants.map(function (v) {
          var inputId = "variant-" + v.id;
          var input = el("input", {
            type: "radio",
            name: "variant",
            id: inputId,
            value: v.id,
            disabled: !v.available,
            checked: selected === v
          });
          input.addEventListener("change", function () {
            selected = v;
            shadeError.hidden = true;
            statusMsg.textContent = "";
            update();
          });
          return el("div", { className: "shade-option" }, [
            input,
            el("label", { for: inputId }, [
              v.swatch ? el("span", { className: "swatch-dot", style: { background: v.swatch }, "aria-hidden": "true" }) : null,
              v.shade || v.id,
              v.available ? null : el("span", { className: "visually-hidden", text: t("product.unavailableSuffix") })
            ])
          ]);
        })),
        shadeError
      ]);
      info.appendChild(shadeFieldset);
    }

    info.appendChild(availabilityNode);

    /* Quantity stepper */
    var qtyInput = el("input", { type: "number", id: "qty", inputmode: "numeric", min: 1, max: settings.maxQty, value: 1 });
    var minus = el("button", { type: "button", "aria-label": t("product.qtyDown"), text: "−" });
    var plus = el("button", { type: "button", "aria-label": t("product.qtyUp"), text: "+" });
    function readQty() {
      var n = parseInt(S.toLatinDigits(qtyInput.value), 10);
      if (!(n >= 1)) n = 1;
      if (n > settings.maxQty) n = settings.maxQty;
      return n;
    }
    function setQty(n) {
      qtyInput.value = String(n);
      minus.disabled = n <= 1;
      plus.disabled = n >= settings.maxQty;
    }
    minus.addEventListener("click", function () { setQty(Math.max(1, readQty() - 1)); });
    plus.addEventListener("click", function () { setQty(Math.min(settings.maxQty, readQty() + 1)); });
    qtyInput.addEventListener("change", function () { setQty(readQty()); });
    setQty(1);

    var addBtn = el("button", { type: "button", className: "btn btn-primary", text: t("product.add") });

    info.appendChild(el("div", { className: "field" }, [
      el("label", { for: "qty", text: t("product.qty") }),
      el("div", { className: "add-row" }, [
        el("div", { className: "qty" }, [plus, qtyInput, minus]),
        addBtn
      ])
    ]));
    info.appendChild(statusMsg);

    addBtn.addEventListener("click", function () {
      statusMsg.className = "status-msg";
      if (!selected) {
        shadeError.textContent = t("product.chooseFirst", { label: labelInSentence });
        shadeError.hidden = false;
        var firstEnabled = shadeFieldset && shadeFieldset.querySelector("input:not([disabled])");
        if (firstEnabled) firstEnabled.focus();
        return;
      }
      if (!selected.available) {
        statusMsg.className = "status-msg is-error";
        statusMsg.textContent = t("product.optionOut");
        return;
      }
      var qty = readQty();
      var result = S.addToCart(cart, product, selected, qty, settings);
      var label = S.itemLabel(product.name, selected.shade);
      statusMsg.className = "status-msg is-ok";
      statusMsg.textContent = "";
      statusMsg.appendChild(document.createTextNode(
        result.capped ? t("product.addedCapped", { max: settings.maxQty }) : t("product.added", { item: label })
      ));
      statusMsg.appendChild(el("a", { href: "cart.html", text: t("product.viewCart") }));
      S.toast(t("toast.added", { item: label }), { href: "cart.html", text: t("product.viewCart") });
    });

    function update() {
      var summary = S.priceSummary(product);
      priceNode.textContent = "";
      if (selected && selected.priceBaisa !== null) priceNode.appendChild(S.priceEl(selected.priceBaisa));
      else if (summary && summary.varies) { priceNode.appendChild(document.createTextNode(t("price.from"))); priceNode.appendChild(S.priceEl(summary.min)); }
      else if (summary) priceNode.appendChild(S.priceEl(summary.min));

      selectedName.textContent = selected ? (selected.shade || "") : t("product.notChosen");

      var anyAvailable = S.isAvailable(product);
      if (!anyAvailable) {
        availabilityNode.className = "availability is-out";
        availabilityNode.textContent = t("product.outOfStock");
      } else if (selected) {
        availabilityNode.className = "availability " + (selected.available ? "is-ok" : "is-out");
        availabilityNode.textContent = selected.available ? t("product.inStock") : t("product.outOfStock");
      } else {
        availabilityNode.className = "availability muted";
        availabilityNode.textContent = t("product.choosePrompt", { label: labelInSentence });
      }

      addBtn.disabled = !anyAvailable;
      addBtn.textContent = anyAvailable ? t("product.add") : t("product.outOfStock");
      qtyInput.disabled = !anyAvailable;
      if (!anyAvailable) { minus.disabled = true; plus.disabled = true; }
    }

    update();
    gallery.classList.add("rise");
    info.classList.add("rise");
    info.style.setProperty("--i", "1");
    root.appendChild(el("div", { className: "product-layout" }, [gallery, info]));
  }).catch(function () {});
})();
