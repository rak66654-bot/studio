# HAMA PRO EDITING 🎵🎬

Aplikasi Video Slide & Visualizer Musik Profesional berbasis web & desktop dengan **Equalizer Liquid Melingkar**, **Transkripsi & Generator Lirik AI Otomatis**, **Audio-Reactive Video Effects**, dan **Ekspor Video MP4/WebM 60FPS**.

---

## 🖥️ BAGIAN 1: Cara Menjalankan di PC Lokal

Anda dapat menjalankan aplikasi ini di komputer/laptop Windows, Mac, atau Linux Anda secara offline maupun online.

### Cara Termudah di Windows (Sekali Klik):
1. Pastikan **Node.js** sudah terpasang di PC Anda (jika belum, unduh installer gratis dari [nodejs.org](https://nodejs.org) - pilih versi LTS).
2. Download atau ekstrak folder project ini ke PC Anda.
3. Cukup **Double-Click** file **`start-windows.bat`**.
4. Script akan otomatis:
   - Menginstal modul dependensi yang dibutuhkan (`npm install`).
   - Menjalankan server aplikasi lokal.
   - Otomatis membuka browser di alamat `http://localhost:3000`.

### Menjalankan via Terminal / CMD / PowerShell:
```bash
# 1. Buka folder proyek di terminal
cd path/ke/folder/hama-pro-editing

# 2. Install dependensi
npm install

# 3. Salin file environment (opsional untuk AI Gemini)
cp .env.example .env

# 4. Jalankan aplikasi di mode pengembangan
npm run dev
```
Buka browser dan akses: `http://localhost:3000`

---

## 📦 BAGIAN 2: Cara Mengubah Menjadi File `.EXE` (Windows Desktop App)

Aplikasi ini sudah dilengkapi konfigurasi **Electron** (`electron/main.cjs`) dan **Electron Builder** (`electron-builder.json`), sehingga dapat langsung dikompilasi menjadi file `.exe` mandiri (standalone) tanpa perlu membuka browser.

### Cara Cepat (Double-Click di Windows):
1. Buka folder proyek ini di Windows Explorer.
2. **Double-Click** file **`build-exe.bat`**.
3. Tunggu proses kompilasi hingga selesai (sekitar 1-3 menit).
4. Folder `dist_electron/` akan otomatis terbuka dan berisi:
   - **`HAMA PRO EDITING-Setup-1.0.0.exe`** : File installer resmi Windows (dengan shortcut Desktop & Start Menu).
   - **`HAMA PRO EDITING-1.0.0-win-x64.exe`** : File Portable (bisa langsung dijalankan tanpa perlu diinstal).

### Cara Manual via Terminal (Command Prompt / PowerShell):
```bash
# 1. Pastikan dependensi terpasang
npm install

# 2. Kompilasi frontend dan paketkan ke Windows .EXE
npm run build:exe
```
Hasil file installer `.exe` dan portable `.exe` akan disimpan di folder `dist_electron/`.

---

## 🚀 BAGIAN 3: Cara Deploy ke Vercel Lewat GitHub

Aplikasi ini juga 100% siap di-deploy ke **Vercel** melalui GitHub:

### Langkah 1: Push Repositori ke GitHub
```bash
git init
git add .
git commit -m "feat: inisialisasi HAMA PRO EDITING siap deploy"

git branch -M main
git remote add origin https://github.com/USERNAME/REPO_NAME.git
git push -u origin main
```

### Langkah 2: Import ke Vercel
1. Buka [Vercel Dashboard](https://vercel.com/new) dan login dengan akun GitHub Anda.
2. Pilih repositori `hama-pro-editing` lalu klik **Import**.
3. Vercel akan otomatis mengenali konfigurasi `vercel.json` (Framework Preset: **Vite**, Output: **dist**).

### Langkah 3: Tambahkan Environment Variable (Opsional)
- Pada bagian **Environment Variables** di Vercel:
  - **Key**: `GEMINI_API_KEY`
  - **Value**: Masukkan API Key Google Gemini Anda dari Google AI Studio.
*(Catatan: Tanpa API key pun aplikasi tetap berfungsi penuh untuk pembuatan video, equalizer, slide foto, dan audio player)*.

### Langkah 4: Klik Deploy!
Website Anda akan langsung aktif secara publik di domain Vercel gratis (misal: `https://hama-pro-editing.vercel.app`).

---

## 📂 Struktur File Penting
- `start-windows.bat` : Script peluncur 1-klik untuk Windows.
- `build-exe.bat` : Script 1-klik untuk membuat file `.exe` installer & portable.
- `electron/main.cjs` : Entry point aplikasi desktop Electron shell.
- `electron-builder.json` : Konfigurasi pemaketan file `.exe` Windows.
- `vercel.json` : Konfigurasi deploy ke Vercel CDN & Serverless Function.
- `api/app.ts` & `api/index.ts` : Backend API modular (Cloud Run, Vercel Serverless, & Desktop).
- `server.ts` : Backend entry point untuk container server lokal / Cloud Run.
