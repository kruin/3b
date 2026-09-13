@echo off
setlocal EnableDelayedExpansion
cd /d "%~dp0"
set "REMOTE=https://github.com/kruin/3b.git"
set "PAGES=https://kruin.github.io/3b"
set "RELEASE=18"
echo ============================================================
echo 3B - PUBLICEREN EN CONTROLEREN
echo ============================================================
where git >nul 2>nul || (echo FOUT: Git ontbreekt.& goto :fout)
for %%F in (index.html styles.css app-v18.js config-v18.js VERSIE.txt) do if not exist "%%F" (echo FOUT: %%F ontbreekt.& goto :fout)
findstr /C:"app-v18.js" index.html >nul || (echo FOUT: index.html laadt app-v18.js niet.& goto :fout)
findstr /C:"config-v18.js" index.html >nul || (echo FOUT: index.html laadt config-v18.js niet.& goto :fout)
if not exist ".git" git init || goto :gitfout
for /f "delims=" %%G in ('git rev-parse --show-toplevel') do set "ROOT=%%G"
for %%G in ("!ROOT!") do set "ROOT=%%~fG"
if /i not "!ROOT!"=="%CD%" (echo FOUT: start de BAT in de hoofdmap van de repository.& goto :fout)
git branch -M main || goto :gitfout
git remote get-url origin >nul 2>nul
if errorlevel 1 (git remote add origin "%REMOTE%" || goto :gitfout) else (
  for /f "delims=" %%R in ('git remote get-url origin') do set "FOUND=%%R"
  if /i not "!FOUND!"=="%REMOTE%" (echo FOUT: origin is !FOUND! maar moet %REMOTE% zijn.& goto :fout)
)
git add . || goto :gitfout
git diff --cached --quiet
if errorlevel 1 git commit -m "Publish 3B version %RELEASE%" || goto :gitfout
git push -u origin main || goto :gitfout
for /f "delims=" %%C in ('git rev-parse HEAD') do set "LOCAL=%%C"
for /f "tokens=1" %%C in ('git ls-remote origin refs/heads/main') do set "REMOTE_COMMIT=%%C"
if /i not "!LOCAL!"=="!REMOTE_COMMIT!" (echo FOUT: lokale en remote commit verschillen.& goto :fout)
echo GitHub Pages wordt maximaal tien minuten gecontroleerd...
set /a TRY=0
:poll
set /a TRY+=1
echo Controle !TRY!/60
powershell -NoProfile -Command "$ProgressPreference='SilentlyContinue'; try {$v=(Invoke-WebRequest -UseBasicParsing -Uri '%PAGES%/VERSIE.txt?c=!LOCAL!^&n=!TRY!' -Headers @{'Cache-Control'='no-cache'}).Content; $h=(Invoke-WebRequest -UseBasicParsing -Uri '%PAGES%/?c=!LOCAL!^&n=!TRY!' -Headers @{'Cache-Control'='no-cache'}).Content; if($v -match 'versie %RELEASE%' -and $h.Contains('app-v18.js') -and $h.Contains('config-v18.js')){exit 0};exit 1}catch{exit 1}"
if not errorlevel 1 goto :klaar
if !TRY! GEQ 60 (echo PUBLICATIE NIET GESLAAGD: Git is bijgewerkt, Pages toont versie %RELEASE% nog niet.& goto :fout)
timeout /t 10 /nobreak >nul
goto :poll
:klaar
echo KLAAR: commit !LOCAL! staat op GitHub en GitHub Pages toont versie %RELEASE%.
echo %PAGES%/
pause
exit /b 0
:gitfout
echo FOUT: Git-opdracht mislukt. Lees de melding hierboven.
:fout
pause
exit /b 1
