#pragma warning disable PSAvoidUsingWriteHost

param(
  [switch]$NoEnv
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

$repoRoot = Split-Path -Parent $PSScriptRoot
Set-Location $repoRoot

$pidFile = Join-Path $repoRoot "data\panel-server.pid"

if (Test-Path $pidFile) {
  $existingPidRaw = (Get-Content -Path $pidFile -Raw -ErrorAction SilentlyContinue).Trim()
  $existingPid = 0
  if ([int]::TryParse($existingPidRaw, [ref]$existingPid) -and $existingPid -gt 0) {
    $existingProc = Get-Process -Id $existingPid -ErrorAction SilentlyContinue
    if ($existingProc -and $existingProc.ProcessName -eq "node") {
      "[TRH] Panel already running (PID $existingPid)."
      exit 0
    }
  }
  Remove-Item -Path $pidFile -Force -ErrorAction SilentlyContinue
}

if (-not $NoEnv) {
  $envFile = Join-Path $repoRoot ".env"
  if (Test-Path $envFile) {
    Get-Content -Path $envFile | ForEach-Object {
      $line = $_.Trim()
      if (-not $line -or $line.StartsWith("#")) {
        return
      }

      $eqIdx = $line.IndexOf("=")
      if ($eqIdx -lt 1) {
        return
      }

      $name = $line.Substring(0, $eqIdx).Trim()
      $value = $line.Substring($eqIdx + 1).Trim()

      if (($value.StartsWith('"') -and $value.EndsWith('"')) -or ($value.StartsWith("'") -and $value.EndsWith("'"))) {
        $value = $value.Substring(1, $value.Length - 2)
      }

      [Environment]::SetEnvironmentVariable($name, $value, "Process")
    }
  }
}

if ([string]::IsNullOrWhiteSpace($env:PANEL_ADMIN_PASSWORD)) {
  throw "PANEL_ADMIN_PASSWORD is not set. Add it in .env or current shell before startup."
}

if ([string]::IsNullOrWhiteSpace($env:OWNER_CONTROL_PASSWORD)) {
  $env:OWNER_CONTROL_PASSWORD = $env:PANEL_ADMIN_PASSWORD
}

$nodeProc = Start-Process -FilePath "node" -ArgumentList "server.js" -WorkingDirectory $repoRoot -NoNewWindow -PassThru
$nodeProc.Id | Set-Content -Path $pidFile -Encoding ASCII
"[TRH] Panel started (PID $($nodeProc.Id))."

try {
  Wait-Process -Id $nodeProc.Id
} finally {
  if (Test-Path $pidFile) {
    $currentPidRaw = (Get-Content -Path $pidFile -Raw -ErrorAction SilentlyContinue).Trim()
    $currentPid = 0
    if ([int]::TryParse($currentPidRaw, [ref]$currentPid) -and $currentPid -eq $nodeProc.Id) {
      Remove-Item -Path $pidFile -Force -ErrorAction SilentlyContinue
    }
  }
}
