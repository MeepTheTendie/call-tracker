@echo off
cd /d "%~dp0"
echo Starting Call Tracker...
echo.
echo Option 1: Open in browser directly
echo Option 2: Start local server (recommended for React)
echo.
set /p choice="Choose (1 or 2): "

if "%choice%"=="1" (
    start "" "http://localhost:5173"
    npx vite
) else if "%choice%"=="2" (
    echo Starting Vite server at http://localhost:5173
    npx vite
) else (
    echo Invalid choice, starting Vite...
    npx vite
)
