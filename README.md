# GAFA KITCHEN — v5 (Katalog Satuan & Pesanan Custom Web)

Website statis HTML + CSS + JavaScript, cocok untuk GitHub Pages, Netlify, dan Cloudflare Pages.

## Katalog produk satuan — harga tampil
- Soes Buah: Rp12.000 / pcs
- Éclair Cokelat: Rp12.000 / pcs
- Soes Cokelat: Rp13.000 / pcs
- Klapertart: Rp17.000 / cup
- Lemper Panggang: Rp8.000 / pcs

## Pesanan khusus — harga hanya via WhatsApp
- Paket 3 Produk (isi 3 produk, detail dan harga dikonfirmasi lewat chat)
- Hampers & Gift Box
- Ulang Tahun & Perayaan
- Acara & Gathering

Kartu Paket 3 Produk dipindahkan dari katalog utama ke bagian **Pesanan Khusus** di bawah katalog; tidak ada informasi harga paket tetap di website. Semua paket ditangani sebagai pesanan berdasarkan permintaan dan ketersediaan. Foto paket hanya referensi hasil digital.

Nomor WhatsApp: +62 812-1150-8109. Seluruh tombol konsultasi membuat pesan sesuai konteks layanan, tanpa checkout dan tanpa pengumpulan data pelanggan di website.

## Memperbarui hosting
1. Scan file ZIP menggunakan antivirus lokal; jika ada peringatan, **jangan abaikan atau whitelist**.
2. Ekstrak ZIP, upload seluruh isi folder (termasuk assets/) ke root GitHub repo, lalu commit.
3. GitHub Pages dan Cloudflare Pages Git integration akan membangun/publish versi terbaru.
4. Netlify yang digunakan dengan drag & drop perlu deploy ulang folder secara manual.

## Keamanan
- Tidak menggunakan library JS eksternal, Google Fonts, tracker, API, atau proses build.
- Tidak ada operasi jaringan otomatis; navigasi keluar hanya ke `wa.me` setelah pelanggan memilih tombol.
- JavaScript membangun kartu produk memakai DOM node/textContent; tidak memakai dynamic `innerHTML`.
- CSP membatasi JavaScript, CSS, gambar ke origin sendiri.
- **Audit statis dan uji browser bukan sertifikasi antivirus**; Microsoft Defender tidak tersedia untuk pemindaian di lingkungan ini.
