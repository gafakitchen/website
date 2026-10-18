/* ============================================================
   GAFA KITCHEN — KONFIGURASI TOKO
   1) Isi WHATSAPP_NUMBER dengan nomor WA toko, format 628xxx.
   2) Ganti produk contoh pada array PRODUCTS di bawah.
   3) Simpan foto asli ke folder assets, lalu ubah image.
   Tidak ada checkout: semua pesanan tetap dikonfirmasi admin.
   ============================================================ */
const WHATSAPP_NUMBER = ""; // CONTOH: "6281234567890" (JANGAN pakai +, spasi, atau 0 depan)

const PRODUCTS = [
  {
    id: "brownies-cokelat", name: "Chocolate Brownies", category: "Brownies",
    badge: "Favorit", image: "assets/brownies.svg",
    description: "Brownies cokelat dengan karakter rasa yang kaya, cocok untuk teman santai maupun hadiah.",
    variants: ["Original", "Extra Chocolate", "Custom / tanya admin"]
  },
  {
    id: "soft-cookies", name: "Soft Cookies", category: "Cookies",
    badge: "Sweet Treat", image: "assets/cookies.svg",
    description: "Cookies bergaya homemade untuk camilan, bingkisan, atau teman secangkir kopi.",
    variants: ["Chocolate Chip", "Mix Cookies", "Custom / tanya admin"]
  },
  {
    id: "banana-cake", name: "Banana Cake", category: "Cake",
    badge: "Pre-Order", image: "assets/banana-cake.svg",
    description: "Pilihan cake bernuansa pisang yang cocok dibagikan bersama keluarga dan sahabat.",
    variants: ["Ukuran reguler", "Ukuran besar", "Custom / tanya admin"]
  },
  {
    id: "dessert-box", name: "Chocolate Dessert Box", category: "Dessert",
    badge: "Manis & Creamy", image: "assets/dessert-box.svg",
    description: "Dessert berlapis dengan sentuhan cokelat untuk momen yang ingin terasa lebih spesial.",
    variants: ["Box personal", "Box sharing", "Custom / tanya admin"]
  },
  {
    id: "marble-cake", name: "Marble Cake", category: "Cake",
    badge: "Homemade", image: "assets/marble-cake.svg",
    description: "Cake bercorak cokelat dan vanila, pas untuk suguhan atau hantaran sederhana.",
    variants: ["Ukuran reguler", "Ukuran besar", "Custom / tanya admin"]
  },
  {
    id: "cupcakes", name: "Mini Cupcakes", category: "Dessert",
    badge: "Untuk Momenmu", image: "assets/cupcakes.svg",
    description: "Pilihan kue mungil yang dapat didiskusikan untuk hadiah dan perayaan.",
    variants: ["Paket kecil", "Paket sharing", "Custom / tanya admin"]
  }
];

const productGrid = document.getElementById("productGrid");
const filters = document.getElementById("categoryFilters");
const searchInput = document.getElementById("productSearch");
const emptyState = document.getElementById("emptyState");
const productDialog = document.getElementById("productDialog");
const setupDialog = document.getElementById("setupDialog");
const orderForm = document.getElementById("orderForm");
const toast = document.getElementById("toast");
let selectedCategory = "Semua";
let toastTimer;
let pendingMessage = "";

// Escaping ensures user-edited catalog strings remain safe inside HTML.
function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, ch => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[ch]));
}

function renderCatalog() {
  const query = searchInput.value.trim().toLocaleLowerCase("id-ID");
  const visible = PRODUCTS.filter(item => {
    const inCategory = selectedCategory === "Semua" || item.category === selectedCategory;
    const searchable = `${item.name} ${item.category} ${item.description}`.toLocaleLowerCase("id-ID");
    return inCategory && searchable.includes(query);
  });

  productGrid.innerHTML = visible.map(item => `
    <article class="product-card">
      <div class="product-image">
        <img src="${escapeHTML(item.image)}" loading="eager" alt="Ilustrasi ${escapeHTML(item.name)}" />
        <span class="product-badge">${escapeHTML(item.badge)}</span>
      </div>
      <div class="product-body">
        <div class="product-category">${escapeHTML(item.category)} · Pre-Order</div>
        <h3 class="product-title">${escapeHTML(item.name)}</h3>
        <p class="product-description">${escapeHTML(item.description)}</p>
        <div class="product-footer">
          <div class="product-price"><small>Harga</small><strong>Tanya via WhatsApp</strong></div>
          <button type="button" class="product-detail-btn" data-product-id="${escapeHTML(item.id)}" aria-label="Lihat detail ${escapeHTML(item.name)}">Lihat Detail <span aria-hidden="true">↗</span></button>
        </div>
      </div>
    </article>
  `).join("");
  emptyState.hidden = visible.length !== 0;
}

filters.addEventListener("click", event => {
  const button = event.target.closest("[data-category]");
  if (!button) return;
  selectedCategory = button.dataset.category;
  filters.querySelectorAll("[data-category]").forEach(chip => {
    const active = chip === button;
    chip.classList.toggle("selected", active);
    chip.setAttribute("aria-pressed", String(active));
  });
  renderCatalog();
});
searchInput.addEventListener("input", renderCatalog);
document.getElementById("resetFilter").addEventListener("click", () => {
  searchInput.value = "";
  filters.querySelector('[data-category="Semua"]').click();
  searchInput.focus();
});

productGrid.addEventListener("click", event => {
  const button = event.target.closest("[data-product-id]");
  if (button) openProduct(button.dataset.productId);
});

function openProduct(id) {
  const product = PRODUCTS.find(p => p.id === id);
  if (!product) return;
  document.getElementById("dialogImage").src = product.image;
  document.getElementById("dialogImage").alt = `Ilustrasi ${product.name}`;
  document.getElementById("dialogTitle").textContent = product.name;
  document.getElementById("dialogDescription").textContent = product.description;
  document.getElementById("dialogCategory").textContent = `${product.category.toUpperCase()} · PRE-ORDER`;
  document.getElementById("orderProductId").value = product.id;
  document.getElementById("orderVariant").replaceChildren(
    ...product.variants.map(name => {
      const option = document.createElement("option"); option.value = name; option.textContent = name; return option;
    })
  );
  document.getElementById("orderQuantity").value = 1;
  document.getElementById("orderDate").value = "";
  document.getElementById("orderNotes").value = "";
  document.getElementById("orderDate").min = localDate();
  productDialog.showModal();
  syncBodyModalState();
}

function localDate() {
  const now = new Date();
  const yyyy = now.getFullYear();
  return `${yyyy}-${String(now.getMonth()+1).padStart(2,"0")}-${String(now.getDate()).padStart(2,"0")}`;
}

function makeOrderMessage(product, fields) {
  return [
    "Halo GAFA KITCHEN! 👋",
    "Saya ingin bertanya dan melakukan pre-order kue berikut:",
    "",
    `🍰 Produk: ${product.name}`,
    `📦 Varian / ukuran: ${fields.variant}`,
    `🔢 Jumlah: ${fields.quantity}`,
    `📅 Tanggal dibutuhkan: ${fields.date || "Belum ditentukan"}`,
    `📝 Catatan: ${fields.notes || "Tidak ada"}`,
    "",
    "Mohon informasi harga, ketersediaan, dan cara konfirmasinya. Terima kasih!"
  ].join("\n");
}

orderForm.addEventListener("submit", event => {
  event.preventDefault();
  if (!orderForm.reportValidity()) return;
  const product = PRODUCTS.find(p => p.id === document.getElementById("orderProductId").value);
  if (!product) return;
  const fields = {
    variant: document.getElementById("orderVariant").value,
    quantity: document.getElementById("orderQuantity").value,
    date: document.getElementById("orderDate").value,
    notes: document.getElementById("orderNotes").value.trim()
  };
  const message = makeOrderMessage(product, fields);
  productDialog.close();
  sendWhatsApp(message);
});

function sendWhatsApp(message) {
  const number = WHATSAPP_NUMBER.replace(/\D/g, "");
  if (!number) {
    pendingMessage = message;
    document.getElementById("messagePreview").textContent = message;
    setupDialog.showModal();
    syncBodyModalState();
    return;
  }
  const url = `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
  // Use the current tab so popup blocking doesn't interrupt the customer.
  window.location.href = url;
}

// Every generic contact button works even before the store WA is configured.
document.querySelectorAll(".js-chat").forEach(button => {
  button.addEventListener("click", () => sendWhatsApp(
    "Halo GAFA KITCHEN! 👋\nSaya ingin bertanya tentang katalog dan cara pre-order kuenya. Terima kasih!"
  ));
});

function syncBodyModalState() {
  document.body.classList.toggle("modal-open", productDialog.open || setupDialog.open);
}
document.getElementById("closeDialog").addEventListener("click", () => productDialog.close());
document.getElementById("closeSetup").addEventListener("click", () => setupDialog.close());
[productDialog, setupDialog].forEach(dialog => {
  dialog.addEventListener("close", syncBodyModalState);
  dialog.addEventListener("click", event => {
    if (event.target === dialog) dialog.close();
  });
});

document.getElementById("copyOrderMessage").addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText(pendingMessage);
    showToast("Pesan berhasil disalin. Tempelkan ke WhatsApp.");
  } catch {
    const textArea = document.createElement("textarea");
    textArea.value = pendingMessage;
    textArea.style.position = "fixed";
    textArea.style.opacity = "0";
    document.body.appendChild(textArea);
    textArea.select();
    const success = document.execCommand("copy");
    textArea.remove();
    showToast(success ? "Pesan berhasil disalin." : "Silakan salin pesan secara manual.");
  }
});
function showToast(message) {
  toast.textContent = message;
  toast.classList.add("visible");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("visible"), 3300);
}

const menuToggle = document.getElementById("menuToggle");
const mobileMenu = document.getElementById("mobileMenu");
function closeMenu() {
  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.setAttribute("aria-label", "Buka menu");
  mobileMenu.hidden = true;
}
menuToggle.addEventListener("click", () => {
  const opening = menuToggle.getAttribute("aria-expanded") !== "true";
  menuToggle.setAttribute("aria-expanded", String(opening));
  menuToggle.setAttribute("aria-label", opening ? "Tutup menu" : "Buka menu");
  mobileMenu.hidden = !opening;
});
mobileMenu.querySelectorAll("a, button").forEach(element => element.addEventListener("click", closeMenu));
document.addEventListener("keydown", event => { if (event.key === "Escape") closeMenu(); });
window.matchMedia("(min-width: 801px)").addEventListener("change", closeMenu);

// Update navigation highlight as the user scrolls.
const navLinks = Array.from(document.querySelectorAll(".desktop-nav .nav-link"));
const sections = ["beranda", "katalog", "cara-pesan", "tentang"].map(id => document.getElementById(id));
if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(entries => {
    const inView = entries.filter(e => e.isIntersecting).sort((a,b) => b.intersectionRatio-a.intersectionRatio)[0];
    if (!inView) return;
    navLinks.forEach(link => link.classList.toggle("active", link.getAttribute("href") === `#${inView.target.id}`));
  }, { rootMargin: "-24% 0px -55% 0px", threshold: [0,.15,.35] });
  sections.forEach(section => observer.observe(section));
}

document.getElementById("currentYear").textContent = new Date().getFullYear();
renderCatalog();
