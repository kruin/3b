@echo off
set "PYTHONUTF8=1"
set "PYTHONIOENCODING=utf-8"
setlocal
cd /d "%~dp0"
set "NODE_PATH_FILE=%TEMP%\3B-node-%RANDOM%-%RANDOM%.txt"
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0Voorbereid_Node_3B.ps1" -PathFile "%NODE_PATH_FILE%"
if errorlevel 1 goto :fout
set /p "DRIEBAND_NODE_DIR="<"%NODE_PATH_FILE%"
del "%NODE_PATH_FILE%" >nul 2>nul
set "PATH=%DRIEBAND_NODE_DIR%;%PATH%"
node browsertest-installatie.js
if errorlevel 1 goto :fout
if /i "%~1"=="--install-only" goto :klaar
node controleer-alles-v206.js
if errorlevel 1 goto :fout
pause
:klaar
endlocal & set "PATH=%DRIEBAND_NODE_DIR%;%PATH%"
exit /b 0
:fout
if exist "%NODE_PATH_FILE%" del "%NODE_PATH_FILE%" >nul 2>nul
if /i not "%~1"=="--install-only" pause
exit /b 1
