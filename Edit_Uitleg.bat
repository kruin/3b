@echo off
setlocal
cd /d "%~dp0"
set "THREEB_UITLEG_PAGE=%~dp0index.html"
powershell -NoProfile -ExecutionPolicy Bypass -Command "$page=[System.Uri]::new($env:THREEB_UITLEG_PAGE).AbsoluteUri; Start-Process ($page + '#owner=kruin&edit=uitleg')"
if errorlevel 1 (
  echo FOUT: de 3B Uitlegeditor kon niet worden geopend.
  pause
  exit /b 1
)
endlocal
