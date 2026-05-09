param(
  [int]$TimeoutSeconds = 25,
  [switch]$NoOpen
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

$repoRoot = Split-Path -Parent $PSScriptRoot
Set-Location $repoRoot

$baseUrl = if ([string]::IsNullOrWhiteSpace($env:APP_BASE_URL)) { "http://localhost:3000" } else { $env:APP_BASE_URL }
$healthUrl = "$baseUrl/api/health"

$deadline = (Get-Date).AddSeconds([Math]::Max($TimeoutSeconds, 1))
$healthy = $false
$lastErrorMessage = ""

while ((Get-Date) -lt $deadline) {
  $invokeErr = $null
  $response = Invoke-RestMethod -Uri $healthUrl -TimeoutSec 2 -ErrorAction SilentlyContinue -ErrorVariable +invokeErr
  if ($response -and $response.ok -eq $true) {
    $healthy = $true
    break
  }
  if ($invokeErr) {
    $last = $invokeErr | Select-Object -Last 1
    if ($last -and $last.Exception -and -not [string]::IsNullOrWhiteSpace($last.Exception.Message)) {
      $lastErrorMessage = $last.Exception.Message
    }
  }
  Start-Sleep -Milliseconds 500
}

if (-not $healthy) {
  if ([string]::IsNullOrWhiteSpace($lastErrorMessage)) {
    throw "Panel health check failed at $healthUrl within $TimeoutSeconds second(s)."
  }
  throw "Panel health check failed at $healthUrl within $TimeoutSeconds second(s): $lastErrorMessage"
}

if (-not $NoOpen) {
  Start-Process $baseUrl | Out-Null
}

"[TRH] Panel healthy at $baseUrl"
