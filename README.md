# Sula Products website

An Arabic, right-to-left catalog for Sula Products (Instagram [@sula__products](https://www.instagram.com/sula__products/)).
Customers browse products, choose shades, fill a cart, and send their order to the store on WhatsApp.
There are no online payments, customer accounts, database, or admin dashboard.

The site is plain HTML, CSS, and JavaScript. There is no build step: the files you see are the files that go online.

---

## 1. The plan

| Stage | What happens | Status |
|---|---|---|
| 1 | First working version with sample products | Done (this folder) |
| 2 | Add the store WhatsApp number and test a real order | Next |
| 3 | Replace sample products and photos with real ones | After stage 2 |
| 4 | Put the code on GitHub | You create the repository, I can push the code |
| 5 | Publish on Cloudflare Pages | Connect the GitHub repository |
| 6 | Refine the design, add the real logo | Any time |

### Assumptions made in the first version

* Prices are in Omani rials with three decimals (for example `3.500`).
* A customer can order up to 10 of one item (change `maxQuantityPerItem` in settings).
* Delivery fees are not set, so the site says delivery is confirmed on WhatsApp.
* "Area" is a free text box with Oman's governorates as suggestions.
* Phone numbers accept 8-digit Omani mobiles (starting with 7 or 9) or international numbers starting with `+`.
* The logo is the text "Sula Products" until you send the real logo.
* All products are clearly marked as samples (تجريبي) and a banner says so on every page.

---

## 2. File structure

```
sula-products/
├── index.html            Homepage (intro, categories, featured products)
├── products.html         Catalog with search and category filters
├── product.html          One product (opened as product.html?id=PRODUCT_ID)
├── cart.html             Cart, checkout form and WhatsApp button
├── 404.html              "Page not found"
├── favicon.svg           Small icon in the browser tab
├── _headers              Cloudflare Pages settings (keeps prices fresh)
├── robots.txt            Lets search engines read the site
├── data/
│   ├── products.json     ← ALL products, shades, prices, stock (you edit this)
│   └── settings.json     ← Store name, WhatsApp, Instagram, delivery (you edit this)
├── images/
│   ├── products/         ← Product photos
│   └── site/             ← Homepage image and fallback image
└── assets/
    ├── css/styles.css    Design (colors are at the top)
    └── js/
        ├── i18n.js       ← Website wording in Arabic and English
        ├── common.js     Shared code: data loading, cart, prices
        ├── home.js       Homepage
        ├── catalog.js    Search and filters
        ├── product.js    Product page
        ├── cart.js       Cart, form and WhatsApp message
        └── notfound.js   404 page
```

Day to day you only touch `data/products.json`, `data/settings.json`, and the `images/` folder.

---

## 3. Preview the site on your computer

The site reads `.json` files, and browsers block that if you just double-click `index.html`.
You need a small local web server. Pick ONE of these:

**Option A: Python (Mac already has it; on Windows install from python.org)**

1. Open Terminal (Mac) or Command Prompt (Windows).
2. Go into the folder: `cd path/to/sula-products`
   (tip: type `cd ` then drag the folder into the window and press Enter).
3. Run: `python3 -m http.server 8000` (on Windows: `python -m http.server 8000`)
4. Open <http://localhost:8000> in your browser.
5. To stop, press `Ctrl + C` in the Terminal window.

**Option B: VS Code**

1. Install [Visual Studio Code](https://code.visualstudio.com/) and the "Live Server" extension.
2. Open the `sula-products` folder in VS Code.
3. Right-click `index.html` → "Open with Live Server".

**Test on your phone:** run option A, find your computer's local IP address (for example `192.168.1.20`), and open `http://192.168.1.20:8000` on a phone connected to the same Wi-Fi.

After editing a file, save it and refresh the browser.

---

## 4. Set up WhatsApp (required before taking orders)

Open `data/settings.json` and fill in `whatsappNumber` with the store number, digits only, starting with the country code and with no `+` or spaces:

```json
"whatsappNumber": "968XXXXXXXX",
```

Until this is filled in, the cart shows a setup message and the WhatsApp button stays disabled.

### What the customer sees

1. They fill in name, phone, area, delivery or pickup, and optional notes.
2. They press **إرسال الطلب عبر واتساب**.
3. WhatsApp opens with a ready message. The site tells them the order is **not sent yet**: they must press send inside WhatsApp, and the store then confirms availability and the final total.
4. Their cart and form details stay saved on their phone in case they come back.

### The message the store receives (example)

```
طلب جديد من موقع Sula Products
(طلب غير مؤكد، بانتظار تأكيد المتجر للتوفر والمبلغ النهائي)

المنتجات:
1) أحمر شفاه
   اللون: وردي هادئ
   رمز المنتج: sample-lipstick
   رمز الخيار: sample-lipstick-rose
   الكمية: 2 × 3.500 ر.ع. = 7.000 ر.ع.

مجموع المنتجات: 7.000 ر.ع.
رسوم التوصيل: تُؤكَّد عبر واتساب

بيانات العميل:
الاسم: …
الهاتف: +968…
المنطقة: مسقط
طريقة الاستلام: توصيل
ملاحظات: لا يوجد
```

### Optional: a fixed delivery fee

If you charge one fixed delivery fee, set it in `settings.json`:

```json
"deliveryFeeOMR": 1.500,
```

Leave it as `null` to keep "delivery is confirmed on WhatsApp". You can also turn off pickup or delivery with `"pickupEnabled": false` or `"deliveryEnabled": false`.

---

## 5. Maintenance guide

Always keep a copy of the file before a big edit. JSON is strict: every item is separated by a comma, but the **last** item in a list has **no** comma. Text goes in "double quotes". If the site shows "تعذّر تحميل المنتجات", paste your file into <https://jsonlint.com> to find the mistake.

### How a product looks

```json
{
  "id": "rose-lipstick",
  "name": "أحمر شفاه مخملي",
  "name_en": "Velvet lipstick",
  "category": "lips",
  "description": "وصف قصير وحقيقي للمنتج.",
  "description_en": "A short, true description of the product.",
  "featured": true,
  "optionLabel": "اللون",
  "optionLabel_en": "Shade",
  "images": [
    { "src": "images/products/rose-lipstick-1.jpg", "alt": "أحمر شفاه مخملي بغطاء ذهبي", "alt_en": "Velvet lipstick with a gold case" }
  ],
  "variants": [
    { "id": "rose-lipstick-01", "shade": "وردي", "shade_en": "Pink", "swatch": "#C98A8F", "price": 3.500, "available": true },
    { "id": "rose-lipstick-02", "shade": "نود", "shade_en": "Nude", "swatch": "#B98068", "price": 3.500, "available": true }
  ]
}
```

| Field | Meaning |
|---|---|
| `id` | Permanent English code for the product: lowercase, numbers, dashes. **Never change it** after launch, because links and saved carts use it. |
| `name` | Arabic name shown on the site. |
| `category` | Must match an `id` in the `categories` list at the top of the file. |
| `description` | Arabic description. Only write true facts. |
| `featured` | `true` shows it on the homepage (4 or 8 featured products look neatest). |
| `optionLabel` | What the options are called: `"اللون"`, `"الدرجة"`, `"الحجم"`. Optional, default is اللون. |
| `images` | One or more photos. The first one is the main photo. `alt` describes the photo in Arabic for blind visitors and Google. |
| `variants` | Every shade/size the customer can choose. |
| variant `id` | Permanent unique code for this shade. Never reuse or change it. |
| `shade` | Shade name shown to the customer. Leave it out for a product with no shades. |
| `swatch` | Optional color circle, a hex color like `"#C98A8F"`. |
| `price` | Price in OMR, for example `3.500`. |
| `available` | `true` or `false`. |

Remove `"sample": true` from real products. When no product has it, the "sample products" banner disappears by itself.

### Add a product

1. Put the photo in `images/products/` (see "Replace images" below).
2. Open `data/products.json`, copy a whole product block from `{` to `}`, and paste it after another product, with a comma between the two blocks.
3. Change the `id`, `name`, `category`, `description`, image, and variants.
4. Save, refresh the local preview, and check the product.

### A product without shades

Give it exactly one variant with no `shade`:

```json
"variants": [
  { "id": "mascara-black-default", "price": 3.900, "available": true }
]
```

### Change a price

Edit `"price"` on the variant. Customers who already had the item in their cart see a message that the price changed, and the cart uses the new price.

### Add or remove a shade

* Add: copy a variant line, give it a **new** `id`, and change the shade, swatch, and price.
* Stop selling a shade: set `"available": false` (better than deleting it). It stays visible but cannot be added, and it is removed from carts with a message.

### Mark a whole product as unavailable

Set `"available": false` on all of its variants. The product shows "غير متوفر" and the button is disabled.

### Replace images

* Use square photos (1:1), about 1200 × 1200 pixels, saved as `.jpg` or `.webp`, ideally under 300 KB. [squoosh.app](https://squoosh.app) shrinks photos for free.
* Name files in English with no spaces, for example `rose-lipstick-1.jpg`.
* Put them in `images/products/` and update the `src` in `products.json`.
* The homepage image is set in `settings.json` under `heroImage` (a 4:3 photo looks best).

### Add a category

Add `{ "id": "nails", "name": "الأظافر" }` to `categories` at the top of `products.json`, then use `"category": "nails"` on products. Categories with no products are hidden.

### Change colors or fonts

Open `assets/css/styles.css`. All colors are at the top under `:root`, for example `--rose` for buttons.

---

### English and Arabic

The site has a language button in the header (English / العربية). Arabic is the default. The visitor's choice is remembered on their phone, and a link ending in `?lang=en` opens the English version directly (handy for sharing).

* Every product text field has an English twin ending in `_en`: `name_en`, `description_en`, `optionLabel_en`, `shade_en`, and `alt_en` on images. Categories have `name_en`.
* Settings have `brandTagline_en`, `intro_en`, `currencyLabel_en`, `deliveryNote_en`, `pickupNote_en`, and `alt_en` on the hero image.
* If you leave an `_en` field out, the English site shows the Arabic text for that field, so nothing breaks.
* Buttons, labels and messages (not product data) are in `assets/js/i18n.js`, one list for `ar` and one for `en`. Change the wording there.
* The WhatsApp message is written in the language the customer is using. Product and option IDs are always included, so the store can match any order.

## 6. Put the code on GitHub (first time)

1. Create a free account on [github.com](https://github.com).
2. Click **+** → **New repository**. Name it `sula-products`, choose **Private** or Public, and click **Create repository**.
3. Tell me the repository name and I can upload the code for you. Or do it yourself: on the empty repository page click **uploading an existing file**, drag in **everything inside** the `sula-products` folder (not the folder itself), and click **Commit changes**.

## 7. Publish on Cloudflare Pages (first time)

1. Create a free account on [dash.cloudflare.com](https://dash.cloudflare.com).
2. Go to **Workers & Pages** → **Create** → **Pages** → **Connect to Git**.
3. Authorize GitHub and pick the `sula-products` repository.
4. Build settings: Framework preset **None**, Build command **empty**, Build output directory **`/`**.
5. Click **Save and Deploy**. After a minute you get a link like `sula-products.pages.dev`.
6. Optional: add your own domain under **Custom domains**.

## 8. Publishing a change (every time)

1. Edit the file on your computer and check it in the local preview.
2. On GitHub, open the file (for example `data/products.json`), click the pencil ✏️, paste the new content, and click **Commit changes**. New photos go through **Add file → Upload files** inside `images/products/`.
3. Cloudflare publishes automatically in about a minute.

---

## 9. Test checklist before going live

* [ ] Homepage, catalog, and a product page open on a phone, also from inside Instagram (put the link in the bio and tap it).
* [ ] Search finds a product by name and by shade name; category buttons filter correctly.
* [ ] "Add to cart" without choosing a shade shows a message.
* [ ] An unavailable shade cannot be chosen.
* [ ] Changing quantities and removing items updates the subtotal.
* [ ] Empty cart shows "سلتك فارغة".
* [ ] Submitting the form empty shows a message under each required field.
* [ ] The WhatsApp message opens with the right products, prices, and customer details, and arrives on the store's phone when sent.
* [ ] Change a price in `products.json`, reload the cart, and see the price-change message.
* [ ] Switch to English and back: every page, the cart, and the WhatsApp message change language, and the cart stays.
