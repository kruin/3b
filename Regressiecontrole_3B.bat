@echo off
setlocal
cd /d "%~dp0"
where node >nul 2>nul || (
  echo FOUT: Node.js is nodig voor de regressiecontrole.
  pause
  exit /b 1
)
node tafelbestandcontrole-v173.js
if errorlevel 1 (
  pause
  exit /b 1
)
node geometriecontrole-v173.js
if errorlevel 1 (
  pause
  exit /b 1
)
node regressiecontrole-v173.js
if errorlevel 1 (
  pause
  exit /b 1
)
node -e "require.resolve('playwright')" >nul 2>nul
if errorlevel 1 (
  echo LET OP: UI-browsertest overgeslagen; Playwright is niet geinstalleerd.
) else (
  node ui-regressie-v173.js
  if errorlevel 1 (pause & exit /b 1)
  node tafelbestand-ui-controle-v173.js
  if errorlevel 1 (
    pause
    exit /b 1
  )
)
echo.
echo Alle vaste menu- en configcontroles zijn geslaagd.
pause
