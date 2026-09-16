@echo off
setlocal
cd /d "%~dp0"
set "THREEB_PAGE=%~dp0index.html"
powershell -NoProfile -ExecutionPolicy Bypass -Command "$page=[System.Uri]::new($env:THREEB_PAGE).AbsoluteUri; Start-Process $page"
if errorlevel 1 (
  echo FOUT: 3B kon niet worden geopend.
  pause
  exit /b 1
)
endlocal
