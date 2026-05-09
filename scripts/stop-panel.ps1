Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

$repoRoot = Split-Path -Parent $PSScriptRoot
Set-Location $repoRoot

$pidFile = Join-Path $repoRoot "data\panel-server.pid"
$stopped = $false

if (Test-Path $pidFile) {
  $pidRaw = (Get-Content -Path $pidFile -Raw -ErrorAction SilentlyContinue).Trim()
  $pidValue = 0
  if ([int]::TryParse($pidRaw, [ref]$pidValue) -and $pidValue -gt 0) {
    $proc = Get-Process -Id $pidValue -ErrorAction SilentlyContinue
    if ($proc -and $proc.ProcessName -eq "node") {
      Stop-Process -Id $pidValue -Force
      Write-Output "[TRH] Stopped panel process PID $pidValue."
      $stopped = $true
    }
  }

  Remove-Item -Path $pidFile -Force -ErrorAction SilentlyContinue
}

if (-not $stopped) {
  $listener = Get-NetTCPConnection -LocalPort 3000 -State Listen -ErrorAction SilentlyContinue | Select-Object -First 1
  if ($listener) {
    $ownerPid = [int]$listener.OwningProcess
    $ownerProc = Get-Process -Id $ownerPid -ErrorAction SilentlyContinue
    if ($ownerProc -and $ownerProc.ProcessName -eq "node") {
      Stop-Process -Id $ownerPid -Force
      Write-Output "[TRH] Stopped panel process on port 3000 (PID $ownerPid)."
      $stopped = $true
    }
  }
}

if (-not $stopped) {
  Write-Output "[TRH] No running panel process found."
}
