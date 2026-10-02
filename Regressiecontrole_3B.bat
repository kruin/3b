@echo off
setlocal
cd /d "%~dp0"
where node >nul 2>nul || (
  echo FOUT: Node.js is nodig voor de regressiecontrole.
  pause
  exit /b 1
)
node cursus-inhoudcontrole-v181.js
if errorlevel 1 (pause & exit /b 1)
node sqlite-appcontrole-v181.js
if errorlevel 1 (pause & exit /b 1)
if exist "..\3B-private-Kruinconfig-v181\SQLite-beheer.html" (
  node beheerbladcontrole-v181.js
  if errorlevel 1 (pause & exit /b 1)
)
node tafelbestandcontrole-v181.js
if errorlevel 1 (
  pause
  exit /b 1
)
node geometriecontrole-v181.js
if errorlevel 1 (
  pause
  exit /b 1
)
node regressiecontrole-v181.js
if errorlevel 1 (
  pause
  exit /b 1
)
node -e "require.resolve('playwright')" >nul 2>nul
if errorlevel 1 (
  echo LET OP: UI-browsertest overgeslagen; Playwright is niet geinstalleerd.
) else (
  if exist "..\3B-private-Kruinconfig-v181\SQLite-beheer.html" (
    node sqlite-beheer-ui-v181.js
    if errorlevel 1 (pause & exit /b 1)
  )
  node cursuscontrole-v181.js
  if errorlevel 1 (pause & exit /b 1)
  node opstartcontrole-v181.js
  if errorlevel 1 (pause & exit /b 1)
  node ui-regressie-v181.js
  if errorlevel 1 (pause & exit /b 1)
  node tafelbestand-ui-controle-v181.js
  if errorlevel 1 (
    pause
    exit /b 1
  )
)
echo.
echo Alle vaste menu- en configcontroles zijn geslaagd.
pause
