@echo off
setlocal
powershell -ExecutionPolicy Bypass -File "%~dp0start-panel.ps1" %*
endlocal
