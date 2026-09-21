# PANDUAN LENGKAP: MENGINSTALL & MENJADIKAN .EXE (HAMA PRO EDITING)

Selamat! Paket ini berisi seluruh source code lengkap **HAMA PRO EDITING** yang sudah disiapkan untuk dijalankan langsung di PC Windows atau dikompilasi menjadi installer/portable file **`.EXE`**.

---

## 📌 SYARAT UTAMA DI PC ANDA
Pastikan komputer / laptop Windows Anda sudah terpasang **Node.js** (versi 18, 20, atau lebih baru).
- Jika belum punya, unduh installer resmi Node.js (pilih LTS): **[https://nodejs.org](https://nodejs.org)**
- Cukup download, klik *Next* sampai selesai, lalu restart Terminal atau Command Prompt Anda.

---

## 🚀 CARA 1: MEMBUAT FILE `.EXE` (Installer & Portable)
Ikuti langkah mudah berikut untuk menghasilkan file **`.exe`** mandiri:

### Langkah Otomatis (Paling Mudah):
1. Buka folder hasil ekstrak ZIP ini di File Explorer Windows Anda.
2. Temukan file **`build-exe.bat`**.
3. **Double-click (klik 2x)** file **`build-exe.bat`**.
4. Skrip otomatis akan:
   - Memeriksa Node.js.
   - Menginstall seluruh dependensi yang diperlukan (`npm install`).
   - Melakukan kompilasi program (`npm run build`).
   - Mengemas aplikasi via Electron Builder menjadi file `.exe`.
5. Setelah selesai, jendela folder **`dist_electron/`** akan otomatis terbuka!
   - Di dalamnya terdapat file installer: **`HAMA PRO EDITING-1.0.0-win-x64.exe`**.
   - Dan versi portable yang bisa langsung dijalankan tanpa instalasi.

---

## 💻 CARA 2: MENJALANKAN LANGSUNG DI PC LOKAL (1-Click)
Jika Anda hanya ingin menjalankan aplikasi di PC lokal secara cepat:
1. **Double-click (klik 2x)** file **`start-windows.bat`**.
2. Aplikasi akan otomatis menginstall dependensi dan membuka browser di `http://localhost:3000`.
3. Anda bisa langsung mengedit video, foto, audio, dan visualizer tanpa koneksi internet.

---

## 🛠️ CARA MANUAL (Jika Ingin Menggunakan Terminal / Command Prompt):
Buka Command Prompt (CMD) di folder ini, lalu jalankan:

```bash
# 1. Install dependensi
npm install

# 2. Buat file .EXE
npm run build:exe

# Atau jika ingin mencoba window Electron terlebih dahulu:
npm run electron:start
```

File `.exe` Anda akan berada di dalam folder `dist_electron/`.
Icon aplikasi, lisensi, dan konfigurasi layar penuh sudah disesuaikan untuk Windows 10 & 11 64-bit.
