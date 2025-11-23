<p align="center">
  <img src="https://img.shields.io/github/stars/fjrmhri/Pomo-Pixel?style=for-the-badge&logo=github&color=8b5cf6" alt="Stars"/>
  <img src="https://img.shields.io/github/license/fjrmhri/Pomo-Pixel?style=for-the-badge&color=10b981" alt="License"/>
  <img src="https://img.shields.io/badge/Next.js-15.1.0-black?style=for-the-badge&logo=next.js" alt="Next.js"/>
  <img src="https://img.shields.io/badge/Firebase-11.1.0-FFCA28?style=for-the-badge&logo=firebase" alt="Firebase"/>
  <img src="https://img.shields.io/badge/Bootstrap-5.3.3-7952B3?style=for-the-badge&logo=bootstrap" alt="Bootstrap"/>
</p>

# MedicaList Admin Dashboard

Dashboard admin berbasis Next.js untuk mengelola data kesehatan (penyakit, obat, alat, apotek) serta percakapan pasien secara real-time. Proyek ini menggunakan Firebase sebagai backend sehingga pembaruan data langsung tercermin di antarmuka.

## Fitur Utama
- **Autentikasi sederhana**: Validasi kredensial admin melalui Firestore sebelum masuk dashboard.
- **CRUD terpusat**: Komponen ResourceManager memudahkan tambah/ubah/hapus data penyakit, obat, alat, dan apotek.
- **Monitoring aktivitas**: Ringkasan metrik dan aktivitas terbaru pengguna pada halaman dashboard.
- **Chat real-time**: Balas pesan pasien dan kelola percakapan dengan Realtime Database.
- **Pengaturan sistem**: Perbarui identitas organisasi, kontak, dan preferensi tampilan dengan sinkronisasi langsung.

## Prasyarat
- Node.js 18+ dan npm
- Akun Firebase dengan Realtime Database serta Firestore aktif

## Cara Instalasi & Menjalankan
1. **Instal dependensi**
   ```bash
   npm install
   ```
2. **Jalankan mode pengembangan**
   ```bash
   npm run dev
   ```
   Aplikasi tersedia di `http://localhost:3000`.
3. **Build & jalankan produksi**
   ```bash
   npm run build
   npm start
   ```

## Konfigurasi Lingkungan
- Salin kredensial Firebase ke `lib/firebase.js` sesuai proyek Anda (apiKey, authDomain, projectId, databaseURL, dst.).
- Jika ingin memakai variabel lingkungan, buat berkas `.env.local` dan referensikan pada `firebaseConfig` sesuai kebutuhan.

## Struktur Direktori Singkat
```
components/
  layout/       // Kerangka layout admin
  resources/    // ResourceManager untuk operasi CRUD
  ui/           // Komponen UI umum (Modal, EmptyState)
lib/            // Inisialisasi Firebase
pages/          // Halaman Next.js (Dashboard, Login, Chat, dll.)
styles/         // CSS Modules per fitur
```

## Lisensi
Proyek dirilis di bawah lisensi MIT. Silakan gunakan, modifikasi, dan distribusikan sesuai kebutuhan organisasi Anda.
