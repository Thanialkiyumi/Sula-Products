/* Homepage: intro text, categories and featured products. */
(function () {
  "use strict";
  var S = window.Sula;

  S.boot().then(function (data) {
    var settings = data.settings, catalog = data.catalog;

    if (settings.intro) document.getElementById("hero-intro").textContent = settings.intro;
    if (settings.heroImage) {
      var hero = document.getElementById("hero-image");
      hero.src = settings.heroImage.src;
      hero.alt = settings.heroImage.alt;
    }

    var catList = document.getElementById("category-list");
    catalog.categories.forEach(function (cat) {
      var count = catalog.products.filter(function (p) { return p.category === cat.id; }).length;
      if (!count) return;
      catList.appendChild(S.el("li", { className: "rise", style: { "--i": String(catList.children.length) } }, [
        S.el("a", { className: "category-card", href: "products.html?category=" + encodeURIComponent(cat.id) }, [
          S.el("strong", { text: cat.name }),
          S.el("span", { text: S.countText(count) })
        ])
      ]));
    });

    var featured = catalog.products.filter(function (p) { return p.featured; });
    if (!featured.length) featured = catalog.products.slice(0, 4);
    var list = document.getElementById("featured-list");
    list.textContent = ""; // remove the loading placeholders
    featured.slice(0, 8).forEach(function (p, i) { list.appendChild(S.productCard(p, i)); });
  }).catch(function () {});
})();
