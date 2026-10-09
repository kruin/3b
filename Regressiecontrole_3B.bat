@echo off
setlocal
cd /d "%~dp0"
where node >nul 2>nul || (
  echo FOUT: Node.js is nodig voor de regressiecontrole.
  pause
  exit /b 1
)
node cursus-inhoudcontrole-v194.js
if errorlevel 1 (pause & exit /b 1)
node sqlite-appcontrole-v194.js
if errorlevel 1 (pause & exit /b 1)
if exist "..\3B-private-Kruinconfig-v194\SQLite-beheer.html" (
  node beheerbladcontrole-v194.js
  if errorlevel 1 (pause & exit /b 1)
)
node tafelbestandcontrole-v194.js
if errorlevel 1 (
  pause
  exit /b 1
)
node geometriecontrole-v194.js
if errorlevel 1 (
  pause
  exit /b 1
)
node virtuele-neuscontrole-v194.js
if errorlevel 1 (pause & exit /b 1)
node menu-negencontrole-v194.js
if errorlevel 1 (pause & exit /b 1)
node regressiecontrole-v194.js
if errorlevel 1 (
  pause
  exit /b 1
)
node -e "require.resolve('playwright')" >nul 2>nul
if errorlevel 1 (
  echo LET OP: UI-browsertest overgeslagen; Playwright is niet geinstalleerd.
) else (
  if exist "..\3B-private-Kruinconfig-v194\SQLite-beheer.html" (
    node sqlite-beheer-ui-v194.js
    if errorlevel 1 (pause & exit /b 1)
  )
  node cursuscontrole-v194.js
  if errorlevel 1 (pause & exit /b 1)
  node opstartcontrole-v194.js
  if errorlevel 1 (pause & exit /b 1)
  node zichtbare-negenbediening-v194.js
  if errorlevel 1 (pause & exit /b 1)
  node ui-regressie-v194.js
  if errorlevel 1 (pause & exit /b 1)
  node sessieherstelcontrole-v194.js
  if errorlevel 1 (pause & exit /b 1)
  node tafelbestand-ui-controle-v194.js
  if errorlevel 1 (
    pause
    exit /b 1
  )
)
echo.
echo Alle vaste menu- en configcontroles zijn geslaagd.
pause
