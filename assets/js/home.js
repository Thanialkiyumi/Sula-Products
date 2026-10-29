/* Homepage: intro text, product showcase, categories and featured products. */
(function () {
  "use strict";
  var S = window.Sula;

  S.boot().then(function (data) {
    var settings = data.settings, catalog = data.catalog;
    var shop = { cart: data.cart, settings: settings };

    if (settings.intro) document.getElementById("hero-intro").textContent = settings.intro;
    var hero = document.getElementById("hero-image");
    if (settings.heroImage) {
      hero.src = settings.heroImage.src;
      hero.alt = settings.heroImage.alt;
    }

    var featured = catalog.products.filter(function (p) { return p.featured; });
    if (!featured.length) featured = catalog.products.slice(0, 4);

    // Hero: up to 4 featured products as large tiles that link to each product.
    // With no products, the hero image from settings.json shows instead.
    var showcase = document.getElementById("hero-showcase");
    if (featured.length) {
      featured.slice(0, 4).forEach(function (p, i) {
        showcase.appendChild(S.el("li", { style: { "--i": String(i + 2) }, className: "rise" }, [
          S.el("a", { href: S.productUrl(p), "aria-label": p.name }, [
            S.imageEl(p.images[0], { alt: "", loading: "eager" }),
            S.el("span", { className: "tile-name", "aria-hidden": "true", text: p.name })
          ])
        ]));
      });
      showcase.hidden = false;
      hero.hidden = true;
      showcase.parentNode.classList.add("has-showcase");
    }

    var catList = document.getElementById("category-list");
    catalog.categories.forEach(function (cat) {
      var inCat = catalog.products.filter(function (p) { return p.category === cat.id; });
      if (!inCat.length) return;
      catList.appendChild(S.el("li", { className: "rise", style: { "--i": String(catList.children.length) } }, [
        S.el("a", { className: "category-card", href: "products.html?category=" + encodeURIComponent(cat.id) }, [
          S.el("span", { className: "category-thumb", "aria-hidden": "true" }, [S.imageEl(inCat[0].images[0], { alt: "", width: 160, height: 160 })]),
          S.el("span", { className: "category-text" }, [
            S.el("strong", { text: cat.name }),
            S.el("span", { text: S.countText(inCat.length) })
          ])
        ])
      ]));
    });

    var list = document.getElementById("featured-list");
    list.textContent = ""; // remove the loading placeholders
    featured.slice(0, 8).forEach(function (p, i) { list.appendChild(S.productCard(p, i, shop)); });
  }).catch(function () {});
})();
