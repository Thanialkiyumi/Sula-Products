/* Homepage: hero banner, photo category tiles, tabbed product row. */
(function () {
  "use strict";
  var S = window.Sula;

  // Prefer a real photo (jpg/png/webp) over a drawn placeholder for category tiles
  function tileImage(products) {
    var withPhoto = products.find(function (p) { return p.images[0] && !/\.svg$/i.test(p.images[0].src); });
    return (withPhoto || products[0]).images[0];
  }

  S.boot().then(function (data) {
    var settings = data.settings, catalog = data.catalog;

    if (settings.intro) document.getElementById("hero-intro").textContent = settings.intro;
    if (settings.heroImage) {
      var hero = document.getElementById("hero-image");
      hero.src = settings.heroImage.src;
      hero.alt = settings.heroImage.alt;
    }
    var instaBtn = document.querySelector("[data-instagram-btn]");
    if (instaBtn) {
      if (settings.instagramUrl) {
        instaBtn.href = settings.instagramUrl;
        if (settings.instagramHandle) instaBtn.textContent = settings.instagramHandle;
      } else {
        instaBtn.closest("section").hidden = true;
      }
    }

    // Categories that have products, each shown as a photo tile
    var usedCats = catalog.categories.filter(function (cat) {
      return catalog.products.some(function (p) { return p.category === cat.id; });
    });
    var catList = document.getElementById("category-list");
    usedCats.forEach(function (cat, i) {
      var inCat = catalog.products.filter(function (p) { return p.category === cat.id; });
      catList.appendChild(S.el("li", { className: "rise", style: { "--i": String(i) } }, [
        S.el("a", { className: "category-tile", href: "products.html?category=" + encodeURIComponent(cat.id) }, [
          S.el("span", { className: "tile-img" }, [S.imageEl(tileImage(inCat), { alt: "" })]),
          S.el("strong", { text: cat.name }),
          S.el("span", { className: "tile-count", text: S.countText(inCat.length) })
        ])
      ]));
    });

    // Tabs: Featured, then one per category (like a "new / best sellers" switcher)
    var featured = catalog.products.filter(function (p) { return p.featured; });
    if (!featured.length) featured = catalog.products.slice(0, 8);
    var tabs = [{ id: "", name: S.t("home.tabFeatured"), products: featured }].concat(usedCats.map(function (cat) {
      return { id: cat.id, name: cat.name, products: catalog.products.filter(function (p) { return p.category === cat.id; }) };
    }));

    var list = document.getElementById("featured-list");
    var tabBox = document.getElementById("product-tabs");
    var viewAll = document.getElementById("view-all");

    function show(tab) {
      tabBox.querySelectorAll("button").forEach(function (b) {
        b.setAttribute("aria-pressed", String(b.getAttribute("data-tab") === tab.id));
      });
      list.textContent = "";
      tab.products.slice(0, 10).forEach(function (p, i) { list.appendChild(S.productCard(p, i)); });
      list.scrollLeft = 0;
      viewAll.href = tab.id ? "products.html?category=" + encodeURIComponent(tab.id) : "products.html";
    }

    tabs.forEach(function (tab) {
      tabBox.appendChild(S.el("button", {
        type: "button",
        className: "tab",
        "data-tab": tab.id,
        "aria-pressed": "false",
        text: tab.name,
        onclick: function () { show(tab); }
      }));
    });
    show(tabs[0]);

    // Arrow buttons scroll the product row by one screen width
    var rtl = document.documentElement.dir === "rtl";
    document.querySelectorAll(".carousel-btn").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var step = Number(btn.getAttribute("data-scroll")) * list.clientWidth * 0.9;
        list.scrollBy({ left: rtl ? -step : step, behavior: "smooth" });
      });
    });
  }).catch(function () {});
})();
