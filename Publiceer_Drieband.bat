@echo off
setlocal EnableDelayedExpansion
cd /d "%~dp0"

set "DRIEBAND_REMOTE=https://github.com/kruin/drieband.git"
set "DRIEBAND_PAGES=https://kruin.github.io/drieband"

echo ============================================================
echo DRIEBAND - PUBLICEREN NAAR GITHUB
echo ============================================================
echo.
echo Publicatiemap: %CD%
if exist "VERSIE.txt" (
  for /f "usebackq delims=" %%V in ("VERSIE.txt") do if not defined APP_VERSIE set "APP_VERSIE=%%V"
  echo Lokale versie: !APP_VERSIE!
) else (
  echo FOUT: VERSIE.txt ontbreekt. Publicatie gestopt.
  goto :einde_fout
)
echo.

where git >nul 2>nul
if errorlevel 1 (
  echo FOUT: Git is niet geinstalleerd of niet beschikbaar in PATH.
  echo Installeer Git for Windows en voer deze BAT daarna opnieuw uit.
  goto :einde_fout
)

if not exist "index.html" (
  echo FOUT: index.html ontbreekt in deze map.
  echo Pak de volledige ZIP uit en start de BAT vanuit die uitgepakte map.
  goto :einde_fout
)

if not exist "app-v8.js" (
  echo FOUT: app-v8.js ontbreekt. Dit is geen volledig versie-8-pakket.
  goto :einde_fout
)
if not exist "config-v8.js" (
  echo FOUT: config-v8.js ontbreekt. Dit is geen volledig versie-8-pakket.
  goto :einde_fout
)
findstr /C:"app-v8.js" "index.html" >nul
if errorlevel 1 (
  echo FOUT: index.html verwijst niet naar app-v8.js.
  goto :einde_fout
)
findstr /C:"config-v8.js" "index.html" >nul
if errorlevel 1 (
  echo FOUT: index.html verwijst niet naar config-v8.js.
  goto :einde_fout
)

if not exist ".git" (
  echo Eerste publicatie: lokale Git-repository wordt gemaakt.
  git init
  if errorlevel 1 goto :git_fout
)

for /f "delims=" %%G in ('git rev-parse --show-toplevel') do set "GIT_ROOT=%%G"
for %%G in ("!GIT_ROOT!") do set "GIT_ROOT_VOLLEDIG=%%~fG"
if /i not "!GIT_ROOT_VOLLEDIG!"=="%CD%" (
  echo FOUT: de BAT staat niet in de hoofdmap van deze Git-repository.
  echo Git-hoofdmap: !GIT_ROOT_VOLLEDIG!
  echo BAT-map:      %CD%
  echo Kopieer de INHOUD van het pakket naar de Git-hoofdmap.
  goto :einde_fout
)

git branch -M main
if errorlevel 1 goto :git_fout

git remote get-url origin >nul 2>nul
if errorlevel 1 (
  git remote add origin "%DRIEBAND_REMOTE%"
  if errorlevel 1 goto :git_fout
) else (
  for /f "delims=" %%R in ('git remote get-url origin') do set "BESTAANDE_REMOTE=%%R"
  if /i not "!BESTAANDE_REMOTE!"=="%DRIEBAND_REMOTE%" (
    echo FOUT: deze map heeft al een andere GitHub-koppeling:
    git remote get-url origin
    echo Verwacht: %DRIEBAND_REMOTE%
    echo De koppeling is voor de veiligheid niet gewijzigd.
    goto :einde_fout
  )
)

git add .
if errorlevel 1 goto :git_fout

git diff --cached --quiet
if errorlevel 1 (
  git commit -m "Werk Drieband-app bij"
  if errorlevel 1 (
    echo.
    echo De commit is niet gemaakt. Controleer of Git je naam en e-mailadres kent.
    echo Zie PUBLICEREN.md onder Problemen oplossen.
    goto :einde_fout
  )
) else (
  echo Geen nieuwe of gewijzigde bestanden om te committen.
)

echo.
echo Publiceren naar GitHub...
git push -u origin main
if errorlevel 1 goto :git_fout

for /f "delims=" %%L in ('git rev-parse HEAD') do set "LOKALE_COMMIT=%%L"
for /f "tokens=1" %%R in ('git ls-remote origin refs/heads/main') do set "REMOTE_COMMIT=%%R"
if /i not "!LOKALE_COMMIT!"=="!REMOTE_COMMIT!" (
  echo FOUT: origin/main wijst niet naar de zojuist gecontroleerde lokale commit.
  echo Lokaal: !LOKALE_COMMIT!
  echo GitHub: !REMOTE_COMMIT!
  goto :einde_fout
)

echo.
echo GitHub Pages wordt gecontroleerd. Dit kan enkele minuten duren.
set /a POGING=0

:controle_pages
set /a POGING+=1
echo Controle !POGING!/24: online versiebestand...
powershell -NoProfile -Command "$ProgressPreference='SilentlyContinue'; try { $v=(Invoke-WebRequest -UseBasicParsing -Uri '%DRIEBAND_PAGES%/VERSIE.txt?commit=!LOKALE_COMMIT!^&poging=!POGING!' -Headers @{'Cache-Control'='no-cache'}).Content.Trim(); if ($v.StartsWith('!APP_VERSIE!')) { exit 0 }; Write-Host ('Nog online: ' + $v.Substring(0,[Math]::Min(80,$v.Length))); exit 1 } catch { Write-Host ('Nog niet bereikbaar: ' + $_.Exception.Message); exit 1 }"
if not errorlevel 1 goto :controle_index
if !POGING! GEQ 24 goto :pages_fout
timeout /t 10 /nobreak >nul
goto :controle_pages

:controle_index
echo Online index.html wordt gecontroleerd...
powershell -NoProfile -Command "$ProgressPreference='SilentlyContinue'; try { $h=(Invoke-WebRequest -UseBasicParsing -Uri '%DRIEBAND_PAGES%/?commit=!LOKALE_COMMIT!' -Headers @{'Cache-Control'='no-cache'}).Content; if ($h.Contains('app-v8.js') -and $h.Contains('config-v8.js')) { exit 0 }; Write-Host 'FOUT: online index.html verwijst niet naar beide versie-8-scripts.'; exit 1 } catch { Write-Host ('FOUT: online index.html kon niet worden gecontroleerd: ' + $_.Exception.Message); exit 1 }"
if errorlevel 1 goto :pages_fout

echo.
echo KLAAR: Git en GitHub Pages bevatten de gecontroleerde versie.
for /f "delims=" %%C in ('git rev-parse --short HEAD') do echo Gepushte commit: %%C
echo Gepubliceerde versie: !APP_VERSIE!
echo Nu kan bij GitHub Settings ^> Pages gekozen worden:
echo   Source: Deploy from a branch
echo   Branch: main
echo   Folder: /(root)
echo Daarna wordt de site: https://kruin.github.io/drieband/
echo.
pause
exit /b 0

:pages_fout
echo.
echo ============================================================
echo PUBLICATIE NIET GESLAAGD
echo ============================================================
echo GitHub branch main is bijgewerkt, maar GitHub Pages toont niet de
echo gecontroleerde versie !APP_VERSIE! met app-v8.js en config-v8.js.
echo.
echo Herstel via GitHub Settings ^> Pages:
echo   1. Zet Branch tijdelijk op None en kies Save.
echo   2. Wacht tot de oude site niet meer beschikbaar is.
echo   3. Kies opnieuw main en /(root) en kies Save.
echo   4. Start deze BAT daarna opnieuw voor een nieuwe controle.
goto :einde_fout

:git_fout
echo.
echo FOUT: Git kon de opdracht niet voltooien.
echo Lees de foutmelding hierboven. Er is niets automatisch verwijderd.

:einde_fout
echo.
pause
exit /b 1
