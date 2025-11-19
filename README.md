# MedicaList Admin Dashboard

MedicaList Admin Dashboard adalah aplikasi Next.js yang digunakan tim medis untuk
mengelola data penyakit, obat, alat, dan jaringan apotek sekaligus memantau
komunikasi pasien melalui chat. Proyek ini telah direfaktor agar mengikuti
praktik clean code, responsif di semua perangkat, dan menyajikan antarmuka
modern yang mudah dipahami.

## Fitur Utama

- **Dashboard ringkas** – menampilkan metrik penting, aktivitas terbaru, dan
  tautan aksi cepat.
- **Manajemen data** – modul CRUD untuk penyakit, obat, alat kesehatan, dan
  apotek dengan pencarian instan.
- **Chat admin** – balas pesan pasien secara real-time dan kelola percakapan
  langsung dari dashboard.
- **Halaman pengaturan** – perbarui identitas organisasi dan preferensi tampilan
  yang tersimpan di Firebase Realtime Database.
- **Autentikasi dasar** – halaman login terhubung ke koleksi `admin` pada
  Firestore.

## Teknologi

- [Next.js 15](https://nextjs.org/) & React 18
- [Firebase Realtime Database & Firestore](https://firebase.google.com/)
- [React Icons](https://react-icons.github.io/react-icons/) untuk ikon UI
- CSS Modules + custom layout components

## Menjalankan Proyek

1. **Instal dependensi**

   ```bash
   npm install
   ```

2. **Menjalankan di mode pengembangan**

   ```bash
   npm run dev
   ```

   Aplikasi tersedia di `http://localhost:3000`.

3. **Build produksi**

   ```bash
   npm run build:next
   npm run start:next
   ```

## Struktur Direktori Penting

```
components/
  layout/        -> Komponen layout dan navigasi utama
  resources/     -> ResourceManager reusable untuk modul CRUD
  ui/            -> Komponen utilitas (Modal, EmptyState)
lib/
  firebase.js    -> Inisialisasi Firebase
pages/
  *.js           -> Halaman Next.js (Dashboard, Chat, Login, dll)
styles/
  *.module.css   -> Styling modular per fitur
```

## Konfigurasi Firebase

Nilai konfigurasi Firebase berada pada `lib/firebase.js`. Pastikan kredensial yang
digunakan memiliki akses ke:

- Firestore koleksi `admin` untuk autentikasi sederhana.
- Realtime Database dengan node `obat`, `alat`, `penyakit`, `apotek`,
  `userActivity`, `chats`, dan `settings/general`.

## Kontribusi

1. Fork repositori dan buat branch fitur: `git checkout -b fitur-anda`.
2. Pastikan `npm run build:next` berjalan tanpa error.
3. Kirim pull request dengan deskripsi perubahan yang jelas.

## Lisensi

Proyek ini dirilis dengan lisensi MIT. Silakan gunakan dan kembangkan sesuai
kebutuhan organisasi Anda.
