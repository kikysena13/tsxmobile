# Riwayat Pembaruan ServerHub

## 2026-10-05 — Dashboard ServerHub v1.0

- Mengganti layar starter Expo dengan dashboard admin Discord bertema gelap.
- Menampilkan ringkasan anggota, anggota online, total pesan, voice activity, grafik aktivitas dengan rentang 24 jam/7 hari/30 hari, dan top members.
- Menambahkan navigasi Expo Router untuk Dashboard, Leaderboard, Activity, dan Settings.
- Menambahkan data demo terpusat dan komponen reusable untuk kartu statistik, panel, status, avatar, serta baris leaderboard.
- Menambahkan layar leaderboard, riwayat aktivitas, dan pengaturan notifikasi/preferensi.
- Data saat ini masih berupa demo; struktur disiapkan untuk integrasi bot Discord dan backend API.
- Mengganti update hydration tema web ke `useSyncExternalStore` agar kompatibel dengan aturan React Hooks lint.
- Menambahkan konfigurasi ESLint Expo beserta dependensi dev yang dibutuhkan oleh script `npm run lint`.

## 2026-10-06 — Penyederhanaan UI/UX

- Mengganti palet neon beragam warna menjadi warna dasar netral dengan satu aksen lembut.
- Menghapus ikon dekoratif, emoji role, badge status yang tidak terhubung, header berulang, serta panel promosi.
- Merapikan dashboard, leaderboard, activity, dan settings agar fokus pada angka dan informasi yang dibutuhkan.
- Membuat ringkasan dan label grafik mengikuti rentang waktu yang dipilih.

## 2026-10-08 — Integrasi Bot Discord

- Menambahkan backend proxy dengan Discord OAuth, pemeriksaan izin admin guild, sesi berumur terbatas, rate limit, serta allowlist CORS.
- Menyimpan sesi mobile melalui SecureStore; token bot dan client secret hanya berada di server.
- Menambahkan endpoint bot `/api/serverhub/dashboard` dengan respons minimum, hitungan pesan per jam, voice activity, leaderboard, dan event terbaru.
- Menghubungkan Dashboard, Activity, Leaderboard, dan Settings ke API serta menghapus penggunaan data mock dari layar.
- Grafik/event mulai terisi setelah bot baru berjalan; online count memerlukan privileged Presence intent.
- Menambahkan `backend/README.md`, Railway healthcheck, `.env.example`, dan test dasar untuk auth serta endpoint health.
