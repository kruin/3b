@echo off
setlocal
cd /d "%~dp0"
where node >nul 2>nul || (
  echo FOUT: Node.js is nodig voor de regressiecontrole.
  pause
  exit /b 1
)
node cursus-inhoudcontrole-v193.js
if errorlevel 1 (pause & exit /b 1)
node sqlite-appcontrole-v193.js
if errorlevel 1 (pause & exit /b 1)
if exist "..\3B-private-Kruinconfig-v193\SQLite-beheer.html" (
  node beheerbladcontrole-v193.js
  if errorlevel 1 (pause & exit /b 1)
)
node tafelbestandcontrole-v193.js
if errorlevel 1 (
  pause
  exit /b 1
)
node geometriecontrole-v193.js
if errorlevel 1 (
  pause
  exit /b 1
)
node regressiecontrole-v193.js
if errorlevel 1 (
  pause
  exit /b 1
)
node -e "require.resolve('playwright')" >nul 2>nul
if errorlevel 1 (
  echo LET OP: UI-browsertest overgeslagen; Playwright is niet geinstalleerd.
) else (
  if exist "..\3B-private-Kruinconfig-v193\SQLite-beheer.html" (
    node sqlite-beheer-ui-v193.js
    if errorlevel 1 (pause & exit /b 1)
  )
  node cursuscontrole-v193.js
  if errorlevel 1 (pause & exit /b 1)
  node opstartcontrole-v193.js
  if errorlevel 1 (pause & exit /b 1)
  node zichtbare-negenbediening-v193.js
  if errorlevel 1 (pause & exit /b 1)
  node ui-regressie-v193.js
  if errorlevel 1 (pause & exit /b 1)
  node sessieherstelcontrole-v193.js
  if errorlevel 1 (pause & exit /b 1)
  node tafelbestand-ui-controle-v193.js
  if errorlevel 1 (
    pause
    exit /b 1
  )
)
echo.
echo Alle vaste menu- en configcontroles zijn geslaagd.
pause
