@echo off
title DevbuPlaytime — Parando servicios...
color 0C
cls
echo.
echo  ████████████████████████████████████████
echo   DEVBUPLAYTIME — Parando servicios
echo  ████████████████████████████████████████
echo.

set "PROJECT_DIR=%~dp0"
if exist "%PROJECT_DIR%backend\package.json" (
    set "ROOT=%PROJECT_DIR%"
) else (
    set "ROOT=%PROJECT_DIR%.."
)

echo  [1/3] Matando procesos Node.js de DevbuPlaytime...
taskkill /F /FI "WINDOWTITLE eq *DevbuPlaytime*" >nul 2>&1
echo  [OK] Procesos Node parados

echo  [2/3] Parando Docker (PostgreSQL)...
cd /d "%ROOT%"
docker-compose stop postgres >nul 2>&1
echo  [OK] PostgreSQL parado

echo  [3/3] Limpieza completada
echo.
echo  ✅ Todo parado correctamente.
echo.
timeout /t 3 /nobreak >nul
exit
