# GAFA KITCHEN — Website Katalog Pre-Order

Website statis responsif menggunakan HTML, CSS, dan JavaScript vanilla. Tanpa sistem keranjang belanja atau checkout. Pesanan disiapkan sebagai pesan WhatsApp dan baru berlaku setelah dikonfirmasi oleh admin.

## Cara membuka

1. Ekstrak ZIP jika perlu.
2. Buka `index.html` menggunakan browser (Chrome, Edge, Firefox, Safari).
3. Seluruh gambar ilustrasi utama dan produk tersimpan lokal di folder `assets/`, sehingga katalog tetap terlihat tanpa internet. Font Google opsional dan membutuhkan internet; browser memiliki font cadangan.

## WAJIB sebelum dipublikasikan

**Nomor WhatsApp** — buka `script.js`, cari:

```js
const WHATSAPP_NUMBER = "";
```

Isi nomor toko dalam format internasional hanya berupa angka. Contoh nomor **fiktif**, bukan nomor toko:

```js
const WHATSAPP_NUMBER = "6281234567890";
```

Contoh di atas memakai kode Indonesia `62`; sesuaikan kode negara dengan nomor sebenarnya. Tombol pesan akan membuka `https://wa.me/NOMOR?text=...`. Jika nomor masih kosong, website menampilkan pesan yang bisa disalin sebagai mode demo.

**Katalog** — edit array `PRODUCTS` dalam `script.js`. Keenam produk yang disertakan hanyalah **contoh**, bukan inventaris resmi GAFA KITCHEN. Ganti nama, kategori, deskripsi, pilihan varian, dan gambar sesuai produk sebenarnya. Saat ini harga tertulis *Tanya via WhatsApp* karena daftar harga belum diberikan.

**Foto** — gambar di `assets/` adalah ilustrasi SVG lokal buatan untuk mockup. Sebelum peluncuran, sangat disarankan menggantinya dengan foto asli kue (WebP/JPG); ubah nilai `image` pada produk dan foto di bagian hero serta Tentang Kami pada `index.html`. Sesuaikan teks alternatif `alt`.

**Data bisnis** — ubah copywriting dan ketentuan pre-order sesuai praktik nyata. Jangan menambahkan klaim tentang sertifikasi, halal, ketersediaan, atau bahan tanpa verifikasi.

## Fitur yang sudah berjalan

- Navigasi responsif desktop/mobile, menu hamburger
- Hero banner, keunggulan, katalog, cara pemesanan, tentang, CTA WhatsApp, footer
- Filter kategori dan pencarian produk secara langsung
- Modal detail produk dengan pilihan varian, jumlah, tanggal kebutuhan, catatan
- Pesan WhatsApp otomatis yang berisi detail kue yang dipilih
- Mode demo saat WhatsApp belum diisi, dengan opsi salin pesan
- Tidak ada checkout atau transaksi pembayaran online
- Aksesibilitas dasar: HTML semantik, label formulir, keyboard focus, dialog native, reduced motion

## Struktur folder

```text
gafa-kitchen-website/
├── index.html
├── style.css
├── script.js
├── README.md
└── assets/
    ├── favicon.svg
    ├── brownies.svg
    ├── cookies.svg
    ├── banana-cake.svg
    ├── dessert-box.svg
    ├── marble-cake.svg
    └── cupcakes.svg
```

## Palet

Cream `#F7EEDB`, Chocolate `#5C3A21`, Caramel `#C98A4A`, Warm White `#FFF9F2`, Soft Beige `#EBDCC8`, Dark Cocoa `#3D2618`.
