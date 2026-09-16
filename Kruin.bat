@echo off
setlocal
cd /d "%~dp0"
set "THREEB_KRUIN_PAGE=%~dp0Kruin.html"
powershell -NoProfile -ExecutionPolicy Bypass -Command "$page=[System.Uri]::new($env:THREEB_KRUIN_PAGE).AbsoluteUri; Start-Process $page"
if errorlevel 1 (
  echo FOUT: 3B Kruin-beheer kon niet worden geopend.
  pause
  exit /b 1
)
endlocal
