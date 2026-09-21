@echo off
title HAMA PRO EDITING - Studio Video & Equalizer
color 0b
echo ======================================================================
echo           HAMA PRO EDITING - Video & Liquid Equalizer Studio
echo ======================================================================
echo.
echo [1/3] Memeriksa Node.js...
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Node.js belum terpasang di komputer Anda!
    echo Silakan unduh dan pasang Node.js terlebih dahulu di: https://nodejs.org
    echo.
    pause
    exit /b
)

echo [2/3] Memeriksa dependensi modul...
if not exist node_modules (
    echo Menginstal dependensi awal (npm install)... Harap tunggu sebentar...
    call npm install
)

echo [3/3] Menjalankan server aplikasi di http://localhost:3000 ...
echo.
echo Membuka browser otomatis dalam 3 detik...
start "" "http://localhost:3000"

npm run dev
pause
