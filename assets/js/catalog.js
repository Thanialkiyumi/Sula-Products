/* Catalog page: search box and category filters.
   Supports links like products.html?category=lips */
(function () {
  "use strict";
  var S = window.Sula;

  S.boot().then(function (data) {
    var catalog = data.catalog;
    var params = new URLSearchParams(location.search);
    var activeCategory = params.get("category") || "";
    if (activeCategory && !catalog.categories.some(function (c) { return c.id === activeCategory; })) activeCategory = "";

    var searchInput = document.getElementById("search");
    var filters = document.getElementById("category-filters");
    var list = document.getElementById("product-list");
    var count = document.getElementById("results-count");
    var noResults = document.getElementById("no-results");

    searchInput.value = params.get("q") || "";

    // Pre-compute searchable text for each product (name, category, shades, ids)
    var index = catalog.products.map(function (p) {
      var text = p.searchText + " " + p.categoryName;
      return { product: p, text: S.normalizeSearch(text) };
    });

    var chips = [{ id: "", name: S.t("catalog.all") }].concat(catalog.categories.filter(function (c) {
      return catalog.products.some(function (p) { return p.category === c.id; });
    }));
    chips.forEach(function (c) {
      filters.appendChild(S.el("button", {
        type: "button",
        className: "chip",
        "data-category": c.id,
        "aria-pressed": String(c.id === activeCategory),
        text: c.name,
        onclick: function () { activeCategory = c.id; render(true); }
      }));
    });

    function updateUrl() {
      var p = new URLSearchParams();
      if (activeCategory) p.set("category", activeCategory);
      if (searchInput.value.trim()) p.set("q", searchInput.value.trim());
      var qs = p.toString();
      try { history.replaceState(null, "", location.pathname + (qs ? "?" + qs : "")); } catch (e) { /* ignore */ }
    }

    function render(fromUser) {
      var words = S.normalizeSearch(searchInput.value).split(" ").filter(Boolean);
      var results = index.filter(function (entry) {
        if (activeCategory && entry.product.category !== activeCategory) return false;
        return words.every(function (w) { return entry.text.indexOf(w) !== -1; });
      }).map(function (entry) { return entry.product; });

      filters.querySelectorAll(".chip").forEach(function (chip) {
        chip.setAttribute("aria-pressed", String(chip.getAttribute("data-category") === activeCategory));
      });

      list.textContent = "";
      results.forEach(function (p, i) { list.appendChild(S.productCard(p, i)); });
      noResults.hidden = results.length > 0;
      count.textContent = results.length === 0 ? S.t("catalog.noResults") : (S.lang === "en" ? S.countText(results.length) : S.t("catalog.count", { n: results.length }));
      if (fromUser) updateUrl();
    }

    var timer;
    searchInput.addEventListener("input", function () {
      clearTimeout(timer);
      timer = setTimeout(function () { render(true); }, 150);
    });
    document.getElementById("clear-filters").addEventListener("click", function () {
      searchInput.value = "";
      activeCategory = "";
      render(true);
      searchInput.focus();
    });

    render(false);
  }).catch(function () {});
})();
