# 📘 Dokumentasi Aplikasi: Pasar Desa Digital

**Versi:** 1.0  
**Tanggal:** 3 Oktober 2025  
**Status:** Final  

---

## Bab 1: Pendahuluan
Dokumen ini menjelaskan secara rinci tentang Aplikasi **"Pasar Desa Digital"**, sebuah platform yang dirancang untuk menjadi etalase digital bagi produk-produk UMKM desa.  
Tujuan utama aplikasi ini bukan sebagai e-commerce dengan fitur transaksi penuh, melainkan sebagai **media promosi modern** untuk menghubungkan pembeli dan penjual secara langsung melalui **WhatsApp**, sejalan dengan kebiasaan transaksi masyarakat lokal.  

Model keberlanjutan aplikasi ini dirancang agar **UMKM dapat mandiri** dan **tidak bergantung pada mahasiswa KKN** secara terus-menerus.  
Peran admin dialihkan kepada warga lokal (misalnya Karang Taruna atau pengurus desa) sebagai **moderator ringan**.  

---

## Bab 2: Pengguna dan Fitur  

### 2.1. Peran Pengguna (User Roles)  
1. **Pembeli (Warga Desa / Pengunjung)**  
   - Tidak memerlukan login untuk mengakses.  
   - Dapat melihat semua produk, profil UMKM, dan mencari produk berdasarkan nama atau kategori.  
   - Dapat menghubungi penjual secara langsung melalui tombol WhatsApp.  

2. **Penjual (Pelaku UMKM)**  
   - Wajib melakukan registrasi dan login untuk mengelola tokonya.  
   - Memiliki kemandirian penuh untuk mengelola produk (**Tambah, Edit, Hapus**).  
   - Dapat mengatur profil toko, termasuk nama, deskripsi, dan nomor WhatsApp.  

3. **Admin Ringan (Moderator Lokal)**  
   - Dipegang oleh warga setempat (misalnya Karang Taruna), **bukan mahasiswa KKN**.  
   - Bertugas membantu reset password UMKM, merapikan kategori produk, dan menonaktifkan akun jika ada penyalahgunaan.  
   - Tidak memerlukan pemantauan aktif setiap hari, hanya bertindak jika ada laporan atau masalah.  

---

### 2.2. Fitur-Fitur Utama  

#### Untuk Pembeli (Publik):  
- Homepage: Menampilkan produk terbaru & unggulan.  
- Kategori Produk: Memfilter produk berdasarkan kategori.  
- Pencarian Produk: Mencari produk berdasarkan nama.  
- Detail Produk: Melihat foto, deskripsi, harga, dan informasi penjual.  
- Tombol Hubungi Penjual: Terhubung langsung ke WhatsApp penjual.  
- Profil UMKM: Melihat semua produk yang dijual oleh satu UMKM.  

#### Untuk Penjual (UMKM):  
- Registrasi & Login: Sistem otentikasi aman menggunakan Supabase.  
- Dashboard UMKM: Ringkasan produk & shortcut manajemen.  
- Manajemen Produk (CRUD): Tambah, edit, hapus produk secara mandiri.  
- Manajemen Profil Toko: Mengubah deskripsi toko & nomor WhatsApp.  

#### Untuk Admin Ringan:  
- Moderasi Akun: Menonaktifkan/aktifkan kembali akun UMKM.  
- Manajemen Kategori: Tambah, edit, atau hapus kategori produk.  
- Reset Password: Membantu UMKM yang kesulitan login.  
- Analitik Sederhana (Opsional):  
  - Jumlah UMKM terdaftar  
  - Jumlah produk  
  - Produk paling populer (berdasarkan views)  
  - Distribusi produk per kategori  

---

## Bab 3: Arsitektur dan Alur Kerja  

### 3.1. Rincian Halaman Aplikasi (Sitemap)  

**Halaman Publik (Tanpa Login)**  
- `/` → Beranda  
- `/products` → Katalog semua produk  
- `/products/[slug-produk]` → Detail produk  
- `/category/[nama-kategori]` → Produk per kategori  
- `/umkm/[id-umkm]` → Profil toko UMKM  

**Halaman Penjual/UMKM (Perlu Login)**  
- `/login`  
- `/register`  
- `/reset-password`  
- `/dashboard` → Dashboard utama  
- `/dashboard/products` → Daftar produk saya  
- `/dashboard/products/add` → Tambah produk  
- `/dashboard/products/edit/[id-produk]` → Edit produk  
- `/dashboard/profile` → Edit profil toko  

**Halaman Admin Ringan (Perlu Login Admin)**  
- `/admin/login`  
- `/admin/dashboard`  
- `/admin/users` → Manajemen pengguna UMKM  
- `/admin/categories` → Manajemen kategori  

---

### 3.2. Struktur Database (Supabase)  

**Tabel `profiles`**  
- `id` (uuid, FK → auth.users.id)  
- `full_name` (text)  
- `store_name` (text)  
- `store_description` (text)  
- `whatsapp_number` (text)  
- `is_active` (boolean)  

**Tabel `products`**  
- `id` (uuid, PK)  
- `owner_id` (uuid, FK → profiles.id)  
- `category_id` (uuid, FK → categories.id)  
- `name` (text)  
- `description` (text)  
- `image_url` (text)  
- `price` (numeric)  

**Tabel `categories`**  
- `id` (uuid, PK)  
- `name` (text)  
- `slug` (text)  

---

### 3.3. Alur Pengguna (User Flow)  

**Alur Pendaftaran UMKM Baru**  
1. UMKM membuka aplikasi → Klik "Daftar".  
2. Mengisi form registrasi → verifikasi via email.  
3. Login → akses dashboard → tambah produk.  

**Alur Pembeli Menghubungi Penjual**  
1. Pembeli melihat daftar produk.  
2. Klik produk → masuk ke halaman detail.  
3. Klik tombol "Hubungi via WhatsApp".  
4. WhatsApp terbuka dengan pesan template.  
5. Transaksi dilanjutkan di luar aplikasi.  

---

## Bab 4: Keberlanjutan dan Teknologi  

### 4.1. Model Keberlanjutan  
1. **Inisiasi (Mahasiswa KKN)**: Membangun & sosialisasi awal.  
2. **Operasional (UMKM Mandiri)**: UMKM kelola produk masing-masing.  
3. **Dukungan (Admin Ringan Desa)**: Moderator lokal menangani masalah teknis ringan.  
4. **Panduan**: Dokumentasi & tutorial disiapkan agar mudah dipelajari.  

### 4.2. Alasan Tidak Menggunakan Payment Gateway  
- **Kesederhanaan**: COD/transfer lebih mudah dipahami masyarakat desa.  
- **Tanpa Biaya Tambahan**: UMKM tidak terbebani biaya transaksi.  
- **Fokus Promosi**: Aplikasi sebagai etalase, bukan marketplace penuh.  

### 4.3. Tumpukan Teknologi (Tech Stack)  
- **Frontend**: Next.js (React Framework)  
- **Backend & Database**: Supabase (PostgreSQL, Auth, Storage)  
- **Deployment**: Vercel  

### 4.4. Keunggulan Model Ini  
✅ Berkelanjutan: Tidak bergantung KKN jangka panjang.  
✅ Memberdayakan: UMKM mandiri kelola toko digital.  
✅ Efisien: Peran admin ringan & tidak rumit.  
✅ Mudah Diteruskan: Struktur jelas untuk serah terima.  

---

## Lampiran  

### A. Panduan untuk Pengguna Akhir  
*(disarankan dibuat PDF dengan screenshot)*  
- Panduan UMKM: registrasi, login, tambah/edit produk, ubah profil.  
- Panduan Admin: cara moderasi akun & kategori.  

### B. Dokumentasi Teknis untuk Pengembang  
- **Setup Proyek Lokal**: instalasi dependencies & jalankan dev server.  
- **Variabel Lingkungan (`.env.local`)**:  
  - `NEXT_PUBLIC_SUPABASE_URL`  
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`  
- **Struktur Folder Proyek**: penjelasan singkat setiap folder.  
- **Proses Deployment**: cara deploy ke Vercel.  

---
