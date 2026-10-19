"use strict";
// GAFA KITCHEN — katalog statis, pre-order via WhatsApp.
// Tidak ada API, cookies, analytics, akun, checkout, atau data yang dikirim ke server website.

const WA_BASE_URL = "https://wa.me/6281211508109";
const PRODUCTS = [
  { id:"soes-buah", name:"Soes Buah", category:"Soes & Pastry", badge:"Favorit Buah", image:"assets/soes-buah.webp", price:12000, unit:"pcs", description:"Soes dengan krim lembut dan topping buah warna-warni. Cocok untuk suguhan dan acara spesial.", variants:["Sesuai contoh foto", "Tanya detail topping / kebutuhan"] },
  { id:"eclair-cokelat", name:"Éclair Cokelat", category:"Soes & Pastry", badge:"Cokelat", image:"assets/eclair-cokelat.webp", price:12000, unit:"pcs", description:"Éclair berlapis cokelat dengan garis dekorasi putih yang khas. Pas untuk pecinta sajian cokelat.", variants:["Sesuai contoh foto", "Tanya detail pesanan"] },
  { id:"soes-cokelat", name:"Soes Cokelat", category:"Soes & Pastry", badge:"Renyah", image:"assets/soes-cokelat.webp", price:13000, unit:"pcs", description:"Soes dengan kulit craquelin bertekstur renyah keemasan. Konfirmasi detail isiannya melalui WhatsApp.", variants:["Sesuai contoh foto", "Tanya detail isian"] },
  { id:"klapertart", name:"Klapertart", category:"Dessert", badge:"Dessert Cup", image:"assets/klapertart.webp", price:17000, unit:"cup", description:"Klapertart dalam cup dengan topping kismis, irisan almond, dan taburan bubuk aromatik seperti pada foto.", variants:["Sesuai contoh foto", "Tanya ketersediaan"] },
  { id:"lemper-panggang", name:"Lemper Panggang", category:"Jajanan Tradisional", badge:"Gurih", image:"assets/lemper-panggang.webp", price:8000, unit:"pcs", description:"Lemper dengan bungkus daun pisang yang dipanggang hingga wangi dan tampak kecokelatan.", variants:["Sesuai contoh foto", "Tanya ketersediaan"] }
];
const $ = id => document.getElementById(id);
const productGrid = $("productGrid");
const filters = $("categoryFilters");
const searchInput = $("productSearch");
const emptyState = $("emptyState");
const productDialog = $("productDialog");
const orderForm = $("orderForm");
let selectedCategory = "Semua";

function formatRupiah(value) {
  return new Intl.NumberFormat("id-ID", {style:"currency", currency:"IDR", minimumFractionDigits:0, maximumFractionDigits:0}).format(value);
}
function node(tag, className, text) {
  const el = document.createElement(tag);
  if (className) el.className = className;
  if (text !== undefined) el.textContent = text;
  return el;
}
function renderCatalog() {
  const normalize = text => String(text).normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase("id-ID");
  const query = normalize(searchInput.value.trim());
  const visible = PRODUCTS.filter(p => (selectedCategory === "Semua" || selectedCategory === p.category) &&
    normalize(`${p.name} ${p.category} ${p.description}`).includes(query));
  const cards = visible.map(p => {
    const card = node("article", "product-card");
    const visual = node("div", "product-image");
    const image = node("img");
    image.src = p.image; image.alt = `Foto ${p.name} GAFA KITCHEN`; image.loading = "lazy"; image.decoding = "async";
    visual.append(image, node("span", "product-badge", p.badge));
    const body = node("div", "product-body");
    const category = node("div", "product-category", `${p.category} · Pre-Order`);
    const title = node("h3", "product-title", p.name);
    const description = node("p", "product-description", p.description);
    const footer = node("div", "product-footer");
    const price = node("div", "product-price");
    price.append(node("small", "", `Harga / ${p.unit}`), node("strong", "", formatRupiah(p.price)));
    const button = node("button", "product-detail-btn", "Lihat Detail ↗");
    button.type = "button"; button.dataset.productId = p.id;
    button.setAttribute("aria-label", `Lihat detail ${p.name}`);
    footer.append(price,button);
    body.append(category,title,description,footer);
    card.append(visual,body);
    return card;
  });
  productGrid.replaceChildren(...cards);
  emptyState.hidden = visible.length > 0;
}
filters.addEventListener("click", e => {
  const button = e.target.closest("[data-category]");
  if (!button) return;
  selectedCategory = button.dataset.category;
  filters.querySelectorAll("[data-category]").forEach(chip => {
    const active = chip === button;
    chip.classList.toggle("selected",active);
    chip.setAttribute("aria-pressed",String(active));
  });
  renderCatalog();
});
searchInput.addEventListener("input",renderCatalog);
$("resetFilter").addEventListener("click",() => {
  searchInput.value = "";
  filters.querySelector('[data-category="Semua"]').click();
  searchInput.focus();
});
productGrid.addEventListener("click", e => {
  const button = e.target.closest("[data-product-id]");
  if (button) openProduct(button.dataset.productId);
});
function localDate() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
}
function openProduct(id) {
  const p = PRODUCTS.find(p => p.id === id);
  if (!p) return;
  $("dialogImage").src = p.image;
  $("dialogImage").alt = `Foto ${p.name}`;
  $("dialogTitle").textContent = p.name;
  $("dialogDescription").textContent = p.description;
  $("dialogCategory").textContent = `${p.category.toUpperCase()} · PRE-ORDER`;
  $("dialogPrice").textContent = `Harga: ${formatRupiah(p.price)} / ${p.unit}`;
  $("orderQuantityLabel").textContent = "Jumlah";
  $("orderProductId").value = p.id;
  $("orderVariant").replaceChildren(...p.variants.map(variant => {
    const option = node("option", "", variant); option.value = variant; return option;
  }));
  $("orderQuantity").value = "1";
  $("orderDate").min = localDate();
  $("orderDate").value = "";
  $("orderNotes").value = "";
  productDialog.showModal();
  document.body.classList.add("modal-open");
}
function makeOrderMessage(p, fields) {
  return [
    "Halo GAFA KITCHEN!",
    "Saya ingin bertanya dan melakukan pre-order:", "",
    `Produk: ${p.name}`,
    `Pilihan/kebutuhan: ${fields.variant}`,
    `Harga katalog: ${formatRupiah(p.price)} / ${p.unit}`,
    `Jumlah ${p.unit}: ${fields.quantity}`,
    `Tanggal dibutuhkan: ${fields.date || "Belum ditentukan"}`,
    `Catatan: ${fields.notes || "Tidak ada"}`, "",
    "Mohon konfirmasi ketersediaan, total harga akhir, dan jadwalnya. Terima kasih."
  ].join("\n");
}
// Navigasi hanya menuju URL WhatsApp yang tetap; teks pesan di-URL-encode.
function sendWhatsApp(message) {
  const destination = new URL(WA_BASE_URL);
  destination.searchParams.set("text", message);
  window.location.assign(destination.toString());
}
orderForm.addEventListener("submit", e => {
  e.preventDefault();
  if (!orderForm.reportValidity()) return;
  const p = PRODUCTS.find(p => p.id === $("orderProductId").value);
  if (!p) return;
  const quantity = Number($("orderQuantity").value);
  if (!Number.isInteger(quantity) || quantity < 1 || quantity > 99) return;
  const fields = {
    variant: $("orderVariant").value,
    quantity,
    date: $("orderDate").value,
    notes: $("orderNotes").value.trim().slice(0,600)
  };
  const message = makeOrderMessage(p, fields);
  productDialog.close();
  sendWhatsApp(message);
});
// Pilihan pesan tetap ditentukan di kode; tidak menyisipkan HTML atau menjalankan URL dari input.
const CHAT_MESSAGES = Object.freeze({
  general: "Halo GAFA KITCHEN! Saya ingin bertanya tentang katalog dan cara pre-order.",
  package3: "Halo GAFA KITCHEN! Saya ingin konsultasi Paket 3 Produk.\nPilihan isi 3 produk: \nJumlah paket: \nTanggal dibutuhkan: \nKemasan/kebutuhan tambahan: \nMohon info pilihan yang tersedia dan estimasi harganya, ya.",
  custom: "Halo GAFA KITCHEN! Saya ingin konsultasi pesanan custom (hampers, ulang tahun, atau acara).\nKebutuhan/acara: \nPerkiraan jumlah: \nTanggal dibutuhkan: \nKonsep/catatan: \nBoleh dibantu untuk pilihan dan harganya?",
  hampers: "Halo GAFA KITCHEN! Saya ingin konsultasi hampers atau gift box.\nUntuk acara/hadiah: \nPerkiraan jumlah kotak: \nTanggal dibutuhkan: \nPilihan isi/kemasan: \nMohon info opsi dan estimasi harganya, ya.",
  birthday: "Halo GAFA KITCHEN! Saya ingin konsultasi pesanan ulang tahun atau perayaan.\nJenis acara: \nPerkiraan jumlah: \nTanggal acara: \nKonsep/dekorasi yang diinginkan: \nMohon info opsi dan estimasi harganya, ya.",
  event: "Halo GAFA KITCHEN! Saya ingin konsultasi suguhan untuk acara.\nJenis acara: \nPerkiraan jumlah: \nTanggal dibutuhkan: \nPilihan produk/kemasan: \nMohon info ketersediaan dan estimasi harganya."
});
document.querySelectorAll(".js-chat").forEach(button => {
  button.addEventListener("click", () => sendWhatsApp(CHAT_MESSAGES[button.dataset.context] || CHAT_MESSAGES.general));
});
$("closeDialog").addEventListener("click",() => productDialog.close());
productDialog.addEventListener("close",() => document.body.classList.remove("modal-open"));
productDialog.addEventListener("click", e => { if (e.target === productDialog) productDialog.close(); });
const menuToggle = $("menuToggle");
const mobileMenu = $("mobileMenu");
function closeMenu() {
  menuToggle.setAttribute("aria-expanded","false");
  menuToggle.setAttribute("aria-label","Buka menu");
  mobileMenu.hidden = true;
}
menuToggle.addEventListener("click",() => {
  const open = menuToggle.getAttribute("aria-expanded") !== "true";
  menuToggle.setAttribute("aria-expanded",String(open));
  menuToggle.setAttribute("aria-label", open ? "Tutup menu" : "Buka menu");
  mobileMenu.hidden = !open;
});
mobileMenu.querySelectorAll("a, button").forEach(item => item.addEventListener("click",closeMenu));
document.addEventListener("keydown", e => { if(e.key === "Escape") closeMenu(); });
window.matchMedia("(min-width: 801px)").addEventListener("change",closeMenu);
const links = Array.from(document.querySelectorAll(".desktop-nav .nav-link"));
if ("IntersectionObserver" in window) {
  const sections = ["beranda","katalog","pesanan-khusus","cara-pesan","tentang"].map(id => $(id));
  const observer = new IntersectionObserver(entries => {
    const entry = entries.filter(e => e.isIntersecting).sort((a,b) => b.intersectionRatio-a.intersectionRatio)[0];
    if (!entry) return;
    links.forEach(link => link.classList.toggle("active",link.getAttribute("href") === `#${entry.target.id}`));
  }, { rootMargin:"-24% 0px -55% 0px", threshold:[0,.15,.35] });
  sections.forEach(section => observer.observe(section));
}
$("currentYear").textContent = String(new Date().getFullYear());
renderCatalog();
