@echo off
set "PYTHONUTF8=1"
set "PYTHONIOENCODING=utf-8"
setlocal
cd /d "%~dp0"
call Installeer_Browsertests_3B.bat --install-only
if errorlevel 1 (pause & exit /b 1)
node controleer-alles-v208.js
if errorlevel 1 (pause & exit /b 1)
pause
