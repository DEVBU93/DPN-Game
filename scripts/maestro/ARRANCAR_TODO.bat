@echo off
title 🚀 La Manada — Arrancando los 3 Proyectos...
color 0A
cls

echo.
echo  ██╗      █████╗     ███╗   ███╗ █████╗ ███╗   ██╗ █████╗ ██████╗  █████╗ 
echo  ██║     ██╔══██╗    ████╗ ████║██╔══██╗████╗  ██║██╔══██╗██╔══██╗██╔══██╗
echo  ██║     ███████║    ██╔████╔██║███████║██╔██╗ ██║███████║██║  ██║███████║
echo  ██║     ██╔══██║    ██║╚██╔╝██║██╔══██║██║╚██╗██║██╔══██║██║  ██║██╔══██║
echo  ███████╗██║  ██║    ██║ ╚═╝ ██║██║  ██║██║ ╚████║██║  ██║██████╔╝██║  ██║
echo  ╚══════╝╚═╝  ╚═╝    ╚═╝     ╚═╝╚═╝  ╚═╝╚═╝  ╚═══╝╚═╝  ╚═╝╚═════╝ ╚═╝  ╚═╝
echo.
echo  ████████████████████████████████████████████████████████████████████████████
echo   🎮 DevbuPlaytime   🌊 AguaFlow   🌐 World-MOS
echo   Arrancando el ecosistema completo de La Manada...
echo   by DEVBU93 - rubenrodriguez.f.93@gmail.com  
echo  ████████████████████████████████████████████████████████████████████████████
echo.

:: ─── Configurar rutas ─────────────────────────────────────────────────────────
:: IMPORTANTE: Edita estas rutas con la ubicación de tus proyectos
:: Por defecto busca en subcarpetas del mismo directorio
set "DEVBU_PATH=%~dp0..\DevbuPlaytime"
set "AGUAFLOW_PATH=%~dp0..\AguaFlow"  
set "WORLDMOS_PATH=%~dp0..\WorldMOS"

:: Si no existen, intentar rutas alternativas comunes
if not exist "%DEVBU_PATH%\backend\package.json" set "DEVBU_PATH=C:\Users\%USERNAME%\Documents\Nebuchadnezzar_DevbuPlayTime"
if not exist "%DEVBU_PATH%\backend\package.json" set "DEVBU_PATH=C:\dev\Nebuchadnezzar_DevbuPlayTime"

if not exist "%AGUAFLOW_PATH%\backend\package.json" set "AGUAFLOW_PATH=C:\Users\%USERNAME%\Documents\AguaFlow"
if not exist "%AGUAFLOW_PATH%\backend\package.json" set "AGUAFLOW_PATH=C:\dev\AguaFlow"

if not exist "%WORLDMOS_PATH%\backend\Mos.sln" set "WORLDMOS_PATH=C:\Users\%USERNAME%\Documents\World-MOS"
if not exist "%WORLDMOS_PATH%\backend\Mos.sln" set "WORLDMOS_PATH=C:\dev\World-MOS"

:: Verificar que se encuentran los proyectos
echo  [CHECK] Verificando proyectos...
set "FOUND=0"

if exist "%DEVBU_PATH%\backend\package.json" (
    echo  [OK] DevbuPlaytime encontrado en: %DEVBU_PATH%
    set /A FOUND+=1
) else (
    echo  [!] DevbuPlaytime NO encontrado en: %DEVBU_PATH%
)

if exist "%AGUAFLOW_PATH%\backend\package.json" (
    echo  [OK] AguaFlow encontrado en: %AGUAFLOW_PATH%
    set /A FOUND+=1
) else (
    echo  [!] AguaFlow NO encontrado en: %AGUAFLOW_PATH%
)

if exist "%WORLDMOS_PATH%\backend\Mos.sln" (
    echo  [OK] World-MOS encontrado en: %WORLDMOS_PATH%
    set /A FOUND+=1
) else (
    echo  [!] World-MOS NO encontrado en: %WORLDMOS_PATH%
)

if "%FOUND%"=="0" (
    echo.
    echo  ═══════════════════════════════════════════════════
    echo   IMPORTANTE: Edita este archivo y configura las rutas
    echo   correctas de tus proyectos (lineas 28-30)
    echo  ═══════════════════════════════════════════════════
    echo.
    pause
    exit /b 1
)

echo.
echo  [DOCKER] Arrancando todas las bases de datos...

:: DevbuPlaytime PostgreSQL
if exist "%DEVBU_PATH%\backend\package.json" (
    cd /d "%DEVBU_PATH%"
    docker-compose up -d postgres >nul 2>&1
    echo  [OK] PostgreSQL DevbuPlaytime :5432
)

:: AguaFlow PostgreSQL
if exist "%AGUAFLOW_PATH%\backend\package.json" (
    cd /d "%AGUAFLOW_PATH%"
    docker-compose up -d postgres >nul 2>&1
    echo  [OK] PostgreSQL AguaFlow :5433
)

:: World-MOS SQL Server
if exist "%WORLDMOS_PATH%\backend\Mos.sln" (
    cd /d "%WORLDMOS_PATH%"
    docker-compose up -d sqlserver >nul 2>&1
    echo  [OK] SQL Server World-MOS :1433
)

echo.
echo  [..] Esperando 15 segundos a que las bases de datos inicialicen...
timeout /t 15 /nobreak >nul

echo.
echo  Arrancando servidores en ventanas separadas...
echo.

:: ── DevbuPlaytime ──
if exist "%DEVBU_PATH%\backend\package.json" (
    echo  [BOOT] DevbuPlaytime Backend...
    start "🎮 DevbuPlaytime — BACKEND :3001" cmd /k "color 0A && echo DEVBUPLAYTIME BACKEND :3001 && cd /d "%DEVBU_PATH%\backend" && (if not exist node_modules npm install) && npx prisma migrate deploy 2>nul && npm run dev"
    timeout /t 2 /nobreak >nul
    echo  [BOOT] DevbuPlaytime Frontend...
    start "🎮 DevbuPlaytime — FRONTEND :5173" cmd /k "color 0B && echo DEVBUPLAYTIME FRONTEND :5173 && cd /d "%DEVBU_PATH%\frontend-web" && (if not exist node_modules npm install) && npm run dev"
)

:: ── AguaFlow ──
if exist "%AGUAFLOW_PATH%\backend\package.json" (
    timeout /t 2 /nobreak >nul
    echo  [BOOT] AguaFlow Backend...
    start "🌊 AguaFlow — BACKEND :3002" cmd /k "color 01 && echo AGUAFLOW BACKEND :3002 && cd /d "%AGUAFLOW_PATH%\backend" && (if not exist node_modules npm install) && npx prisma migrate deploy 2>nul && npm run dev"
    timeout /t 2 /nobreak >nul
    echo  [BOOT] AguaFlow Frontend...
    start "🌊 AguaFlow — FRONTEND :5174" cmd /k "color 03 && echo AGUAFLOW FRONTEND :5174 && cd /d "%AGUAFLOW_PATH%\frontend-web" && (if not exist node_modules npm install) && npm run dev -- --port 5174"
)

:: ── World-MOS ──
if exist "%WORLDMOS_PATH%\backend\Mos.sln" (
    timeout /t 2 /nobreak >nul
    echo  [BOOT] World-MOS Backend .NET...
    start "🌐 World-MOS — BACKEND :5000" cmd /k "color 0E && echo WORLD-MOS BACKEND :5000 && cd /d "%WORLDMOS_PATH%\backend" && dotnet restore 2>nul && dotnet run --project Mos.Api --urls http://localhost:5000"
    timeout /t 2 /nobreak >nul
    echo  [BOOT] World-MOS Frontend...
    start "🌐 World-MOS — FRONTEND :5175" cmd /k "color 0D && echo WORLD-MOS FRONTEND :5175 && cd /d "%WORLDMOS_PATH%\frontend-web" && (if not exist node_modules npm install) && npm run dev -- --port 5175"
)

echo.
echo  [..] Esperando 15 segundos a que todo arranque...
timeout /t 15 /nobreak >nul

echo.
echo  Abriendo navegadores...
if exist "%DEVBU_PATH%\backend\package.json" start "" "http://localhost:5173"
timeout /t 1 /nobreak >nul
if exist "%AGUAFLOW_PATH%\backend\package.json" start "" "http://localhost:5174"
timeout /t 1 /nobreak >nul
if exist "%WORLDMOS_PATH%\backend\Mos.sln" start "" "http://localhost:5175"

cls
echo.
echo  ████████████████████████████████████████████████████████████████████
echo.
echo   ✅  ECOSISTEMA COMPLETO DE LA MANADA ARRANCADO
echo.
echo  ████████████████████████████████████████████████████████████████████
echo.
echo   🎮  DEVBUPLAYTIME    → http://localhost:5173
echo       API/Swagger      → http://localhost:3001/api-docs
echo.  
echo   🌊  AGUA FLOW        → http://localhost:5174
echo       API              → http://localhost:3002
echo.
echo   🌐  WORLD-MOS        → http://localhost:5175
echo       API/Swagger      → http://localhost:5000/swagger
echo.
echo  ────────────────────────────────────────────────────────────────────
echo.
echo   Para PARAR todo: ejecuta PARAR_TODO.bat
echo.
echo  ████████████████████████████████████████████████████████████████████
echo.
timeout /t 30 /nobreak >nul
exit
