@echo off
setlocal
cd /d "%~dp0"
echo ============================================================
echo 3B - BETALEN ACTIVEREN IN DE OPENBARE APP
echo ============================================================
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0Activeer_Betalen.ps1"
if errorlevel 1 goto :fout
echo.
echo KLAAR: de openbare Supabase-gegevens zijn ingevuld.
echo Publiceer nu met Publiceer_3B.bat nadat de serverfunctie is geplaatst.
pause
exit /b 0
:fout
echo.
echo FOUT: betalen is niet geactiveerd. Er is niets gepubliceerd.
pause
exit /b 1
