@echo off
setlocal
powershell -ExecutionPolicy Bypass -File "%~dp0open-panel.ps1" %*
endlocal
