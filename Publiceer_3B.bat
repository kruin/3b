@echo off
set "PYTHONUTF8=1"
set "PYTHONIOENCODING=utf-8"
setlocal EnableDelayedExpansion
cd /d "%~dp0"
set "REMOTE=https://github.com/kruin/3b.git"
set "PAGES=https://kruin.github.io/3b"
set "RELEASE=208"
set "GIT_RECOVERY="
echo ============================================================
echo 3B - PUBLICEREN EN CONTROLEREN
echo ============================================================
if /i "%~1"=="--pages-only" goto :pagesonly
where git >nul 2>nul || (echo FOUT: Git ontbreekt.& goto :fout)
for %%F in (package.json package-lock.json Installeer_Browsertests_3B.bat Voorbereid_Node_3B.ps1 browsertest-installatie.js index.html doc\index.html styles.css cursuscontrole-v208.js tafelbestanden-v208.js tafelbestandcontrole-v208.js tafelbestand-ui-controle-v208.js basis-catalogus-v208.js beheer-basisarchief-v208.js vendor\xlsx.full.min.js vendor\sql-asm.js app-v208.js config-v208.js kruinwaarden-generated-v208.js regressiecontrole-v208.js ui-regressie-v208.js zichtbare-negenbediening-v208.js Regressiecontrole_3B.bat VERSIE.txt START-HIER.md HANDLEIDING-GEBRUIKER.md EDIT-WERKWIJZE.md .gitignore Kruin.html Kruin.bat Kruin.command SESSIES-INSTALLEREN.md supabase-session-schema.sql BETALEN-ACTIVEREN.md Activeer_Betalen.bat Activeer_Betalen.ps1 supabase\config.toml supabase\functions\create-mollie-payment\index.ts uitleg-lokaal\BEWAAR-UITLEG-HIER.txt) do if not exist "%%F" (echo FOUT: %%F ontbreekt.& goto :fout)
call Installeer_Browsertests_3B.bat --install-only
if errorlevel 1 goto :fout
if /i "%~1"=="--all-tests" (
  node controleer-alles-v208.js || goto :fout
) else (
  echo App-tests worden niet herhaald. Gebruik --all-tests voor de volledige controle.
)
findstr /C:"Geldig voor versie 208" HANDLEIDING-GEBRUIKER.md >nul || (echo FOUT: gebruikershandleiding hoort niet bij versie %RELEASE%.& goto :fout)
findstr /C:"app-v208.js" index.html >nul || (echo FOUT: index.html laadt app-v208.js niet.& goto :fout)
findstr /C:"config-v208.js" index.html >nul || (echo FOUT: index.html laadt config-v208.js niet.& goto :fout)
findstr /C:"kruinwaarden-generated-v208.js" index.html >nul || (echo FOUT: index.html laadt de gegenereerde Kruinwaarden niet.& goto :fout)
findstr /C:"styles.css?v=208" index.html >nul || (echo FOUT: index.html gebruikt niet de nieuwe stylesheetversie.& goto :fout)
findstr /C:"paymentEnabled: true" config-v208.js >nul || echo LET OP: betalen is nog niet geactiveerd; de rest van v208 kan wel worden gepubliceerd.
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
rem Herstel vroegere basisbestanden uit Git voordat de nieuwe release wordt toegevoegd.
git ls-tree --name-only HEAD kruin-bases | findstr /C:"kruin-bases" >nul
if not errorlevel 1 (
  git restore --source=HEAD --worktree -- kruin-bases || goto :gitfout
)
node beheer-basisarchief-v208.js || goto :gitfout
node tafelbestandcontrole-v208.js || goto :fout
git rm -r --cached --ignore-unmatch HANDLEIDING-KRUIN.md config-input >nul 2>nul
git add . || goto :gitfout
git diff --cached --quiet
if errorlevel 1 git commit -m "Publish 3B version %RELEASE%" || goto :gitfout
git push -u origin main || goto :gitfout
for /f "delims=" %%C in ('git rev-parse HEAD') do set "LOCAL=%%C"
for /f "tokens=1" %%C in ('git ls-remote origin refs/heads/main') do set "REMOTE_COMMIT=%%C"
if /i not "!LOCAL!"=="!REMOTE_COMMIT!" (echo FOUT: lokale en remote commit verschillen.& goto :fout)
node pages-controle-v208.js --base-url "%PAGES%/" || goto :fout
goto :klaar
:pagesonly
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0Voorbereid_Node_3B.ps1" -PathFile "%TEMP%\3B-pages-node.txt"
if errorlevel 1 goto :fout
set /p "DRIEBAND_NODE_DIR="<"%TEMP%\3B-pages-node.txt"
del "%TEMP%\3B-pages-node.txt" >nul 2>nul
set "PATH=!DRIEBAND_NODE_DIR!;%PATH%"
node pages-controle-v208.js --base-url "%PAGES%/"
if errorlevel 1 goto :fout
if /i not "%~1"=="--from-beheer" pause
exit /b 0
:klaar
echo KLAAR: commit !LOCAL! staat op GitHub en GitHub Pages toont versie %RELEASE%.
echo %PAGES%/
if /i not "%~1"=="--from-beheer" pause
exit /b 0
:clonefout
if defined GIT_RECOVERY if exist "!GIT_RECOVERY!" rmdir /S /Q "!GIT_RECOVERY!"
echo FOUT: GitHub kon niet worden gekloond; er is niets gepubliceerd.
goto :fout
:gitfout
echo FOUT: Git-opdracht mislukt. Lees de melding hierboven.
:fout
if /i not "%~1"=="--from-beheer" pause
exit /b 1
