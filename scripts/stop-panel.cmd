@echo off
setlocal
powershell -ExecutionPolicy Bypass -File "%~dp0stop-panel.ps1" %*
endlocal
