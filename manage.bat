@echo off
setlocal enabledelayedexpansion

:: Ensure working directory is the app directory containing package.json
if exist "%~dp0package.json" (
    cd /d "%~dp0"
) else if exist "%~dp0app\package.json" (
    cd /d "%~dp0app"
)

:: Check for CLI arguments
if "%~1" == "dev" goto start_dev
if "%~1" == "prod" goto start_prod
if "%~1" == "start" goto start_only
if "%~1" == "build" goto build_prod
if "%~1" == "studio" goto start_studio
if "%~1" == "stop" goto stop
if "%~1" == "restart" goto restart_dev

:menu
cls
echo ==============================================================
echo   🏛️  Cabanatuan City Ordinance Portal - Manager
echo ==============================================================
echo.
echo   App Portal    : http://localhost:3000
echo   Prisma Studio : http://localhost:5555
echo.
echo   [1] Start in Development Mode (npm run dev)
echo   [2] Build & Start Production Mode (npm run build + start)
echo   [3] Start Production Server Only (npm run start)
echo   [4] Open Prisma Studio (Database GUI on :5555)
echo   [5] Build Production Bundle (npm run build)
echo   [6] Stop All Active Servers (:3000 & :5555)
echo   [7] Restart Development Server
echo   [8] Exit
echo.
set /p choice="Select an option [1-8]: "

if "%choice%"=="1" goto start_dev
if "%choice%"=="2" goto start_prod
if "%choice%"=="3" goto start_only
if "%choice%"=="4" goto start_studio
if "%choice%"=="5" goto build_prod
if "%choice%"=="6" goto stop
if "%choice%"=="7" goto restart_dev
if "%choice%"=="8" exit /b 0
goto menu

:start_dev
echo.
echo [+] Starting Cabanatuan City Ordinance Portal in Development Mode...
start "Cabanatuan Ordinance Portal (Dev - :3000)" cmd /c "npm run dev"
echo [*] Server starting on http://localhost:3000 in a new window.
echo.
if "%~1" == "" pause && goto menu
exit /b 0

:start_prod
echo.
echo [+] Building and Starting Production Bundle...
echo [*] Step 1/2: Compiling static and dynamic routes...
call npm run build
if %ERRORLEVEL% NEQ 0 (
    echo [!] Build failed! Please check error logs above.
    pause
    goto menu
)
echo.
echo [+] Step 2/2: Starting Optimized Production Server...
start "Cabanatuan Ordinance Portal (Prod - :3000)" cmd /c "npm run start"
echo [*] Production server running on http://localhost:3000 in a new window.
echo.
if "%~1" == "" pause && goto menu
exit /b 0

:start_only
echo.
echo [+] Starting Production Server Only (:3000)...
start "Cabanatuan Ordinance Portal (Prod - :3000)" cmd /c "npm run start"
echo [*] Production server running on http://localhost:3000.
echo.
if "%~1" == "" pause && goto menu
exit /b 0

:start_studio
echo.
echo [+] Launching Prisma Studio Database Manager...
start "Prisma Studio (:5555)" cmd /c "npx prisma studio"
echo [*] Prisma Studio is opening on http://localhost:5555.
echo.
if "%~1" == "" pause && goto menu
exit /b 0

:build_prod
echo.
echo [+] Building Next.js Production Bundle...
call npm run build
echo.
echo [*] Build completed.
if "%~1" == "" pause && goto menu
exit /b 0

:stop
echo.
echo [-] Stopping all active portal servers...
set "found=0"

:: Kill process listening on port 3000 (Next.js App)
for /f "tokens=5" %%p in ('netstat -aon ^| findstr :3000 ^| findstr LISTENING') do (
    taskkill /F /T /PID %%p >nul 2>&1
    set "found=1"
)

:: Kill process listening on port 5555 (Prisma Studio)
for /f "tokens=5" %%p in ('netstat -aon ^| findstr :5555 ^| findstr LISTENING') do (
    taskkill /F /T /PID %%p >nul 2>&1
    set "found=1"
)

if "!found!"=="0" (
    echo [*] No active portal servers found on ports 3000 or 5555.
) else (
    echo [*] Successfully stopped all portal servers.
)
echo.
if "%~1" == "" pause && goto menu
exit /b 0

:restart_dev
echo.
echo [*] Restarting Development Server...
for /f "tokens=5" %%p in ('netstat -aon ^| findstr :3000 ^| findstr LISTENING') do (taskkill /F /T /PID %%p >nul 2>&1)
for /f "tokens=5" %%p in ('netstat -aon ^| findstr :5555 ^| findstr LISTENING') do (taskkill /F /T /PID %%p >nul 2>&1)
timeout /t 2 >nul
goto start_dev
