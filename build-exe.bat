@echo off
title HAMA PRO EDITING - Build Windows .EXE
color 0a
echo ======================================================================
echo           HAMA PRO EDITING - Kompilasi ke Windows .EXE
echo ======================================================================
echo.
echo [1/4] Memeriksa Node.js...
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Node.js belum terpasang di komputer Anda!
    echo Silakan unduh dan pasang Node.js terlebih dahulu di: https://nodejs.org
    echo.
    pause
    exit /b
)

echo [2/4] Memeriksa dependensi proyek...
if not exist node_modules (
    echo Menginstal dependensi...
    call npm install
)

echo [3/4] Melakukan build frontend & server...
call npm run build

echo [4/4] Memaketkan aplikasi menjadi file .EXE installer & portable via Electron Builder...
npx electron-builder --win --config electron-builder.json

echo.
echo ======================================================================
echo  SELESAI! File .exe telah berhasil dibuat di dalam folder: dist_electron/
echo ======================================================================
echo.
if exist dist_electron (
    explorer dist_electron
)
pause
