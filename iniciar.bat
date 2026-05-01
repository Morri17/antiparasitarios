@echo off
echo Iniciando Antiparasitarios...
echo.

:: Iniciar backend en nueva ventana
start "Backend - Antiparasitarios" cmd /k "cd /d "%~dp0backend" && node server.js"

:: Esperar 2 segundos para que el backend levante
timeout /t 2 /nobreak >nul

:: Iniciar frontend en nueva ventana
start "Frontend - Antiparasitarios" cmd /k "cd /d "%~dp0frontend" && npm run dev"

echo.
echo Backend:  http://localhost:3001
echo Frontend: http://localhost:5173
echo.
echo Abriendo el navegador en 3 segundos...
timeout /t 3 /nobreak >nul
start http://localhost:5173
