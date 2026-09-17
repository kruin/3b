@echo off
setlocal EnableDelayedExpansion
cd /d "%~dp0"
set "REMOTE=https://github.com/kruin/3b.git"
set "PAGES=https://kruin.github.io/3b"
set "RELEASE=73"
set "GIT_RECOVERY="
echo ============================================================
echo 3B - PUBLICEREN EN CONTROLEREN
echo ============================================================
where git >nul 2>nul || (echo FOUT: Git ontbreekt.& goto :fout)
for %%F in (index.html doc\index.html styles.css app-v73.js config-v73.js VERSIE.txt START-HIER.md EDIT-WERKWIJZE.md .gitignore Kruin.html Kruin.bat Kruin.command SESSIES-INSTALLEREN.md supabase-session-schema.sql) do if not exist "%%F" (echo FOUT: %%F ontbreekt.& goto :fout)
findstr /C:"app-v73.js" index.html >nul || (echo FOUT: index.html laadt app-v73.js niet.& goto :fout)
findstr /C:"config-v73.js" index.html >nul || (echo FOUT: index.html laadt config-v73.js niet.& goto :fout)
findstr /C:"styles.css?v=73" index.html >nul || (echo FOUT: index.html gebruikt niet de nieuwe stylesheetversie.& goto :fout)
findstr /C:"3B-documentatie" doc\index.html >nul || (echo FOUT: Doc heeft niet de verwachte ingang.& goto :fout)
findstr /C:"Kruin.html" Kruin.bat >nul || (echo FOUT: Kruin.bat opent de gedeelde Kruin-ingang niet.& goto :fout)
findstr /C:"Kruin.html" Kruin.command >nul || (echo FOUT: Kruin.command opent de gedeelde Kruin-ingang niet.& goto :fout)
findstr /C:"owner=kruin" Kruin.html >nul || (echo FOUT: Kruin.html opent het Kruin-beheer niet.& goto :fout)
if exist ".git" goto :gitgereed
echo Geen lokale .git gevonden.
echo De Git-geschiedenis wordt eerst veilig opgehaald van GitHub...
set "GIT_RECOVERY=%TEMP%\3b_git_restore_!RANDOM!_!RANDOM!"
if exist "!GIT_RECOVERY!" (echo FOUT: tijdelijke herstelmap bestaat al.& goto :fout)
git clone --no-checkout --single-branch --branch main "%REMOTE%" "!GIT_RECOVERY!" || goto :clonefout
if not exist "!GIT_RECOVERY!\.git" goto :clonefout
xcopy "!GIT_RECOVERY!\.git" ".git\" /E /H /I /Q /Y >nul || goto :clonefout
if not exist ".git" goto :clonefout
rmdir /S /Q "!GIT_RECOVERY!"
set "GIT_RECOVERY="
echo Git-geschiedenis hersteld. De huidige 3B-bestanden zijn behouden.
:gitgereed
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
powershell -NoProfile -Command "$ProgressPreference='SilentlyContinue'; try {$v=(Invoke-WebRequest -UseBasicParsing -Uri '%PAGES%/VERSIE.txt?c=!LOCAL!^&n=!TRY!' -Headers @{'Cache-Control'='no-cache'}).Content; $h=(Invoke-WebRequest -UseBasicParsing -Uri '%PAGES%/?c=!LOCAL!^&n=!TRY!' -Headers @{'Cache-Control'='no-cache'}).Content; $d=(Invoke-WebRequest -UseBasicParsing -Uri '%PAGES%/doc/?c=!LOCAL!^&n=!TRY!' -Headers @{'Cache-Control'='no-cache'}).Content; if($v -match 'versie %RELEASE%' -and $h.Contains('app-v73.js') -and $h.Contains('config-v73.js') -and $h.Contains('styles.css?v=73') -and $d.Contains('3B-documentatie')){exit 0};exit 1}catch{exit 1}"
if not errorlevel 1 goto :klaar
if !TRY! GEQ 60 (echo PUBLICATIE NIET GESLAAGD: Git is bijgewerkt, Pages toont versie %RELEASE% nog niet.& goto :fout)
timeout /t 10 /nobreak >nul
goto :poll
:klaar
echo KLAAR: commit !LOCAL! staat op GitHub en GitHub Pages toont versie %RELEASE%.
echo %PAGES%/
pause
exit /b 0
:clonefout
if defined GIT_RECOVERY if exist "!GIT_RECOVERY!" rmdir /S /Q "!GIT_RECOVERY!"
echo FOUT: GitHub kon niet worden gekloond; er is niets gepubliceerd.
goto :fout
:gitfout
echo FOUT: Git-opdracht mislukt. Lees de melding hierboven.
:fout
pause
exit /b 1
