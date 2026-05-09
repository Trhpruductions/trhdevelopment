param(
  [Parameter(Mandatory = $true)]
  [string]$Version,
  [string]$FromTag = ""
)

$ErrorActionPreference = "Stop"

# In PowerShell 7+, native command stderr can be promoted to Error records and
# terminate script execution when ErrorActionPreference is Stop. Disable this
# behavior so non-fatal tool warnings do not fail release automation.
if (Get-Variable -Name PSNativeCommandUseErrorActionPreference -ErrorAction SilentlyContinue) {
  $PSNativeCommandUseErrorActionPreference = $false
}

if ($Version -notmatch "^[0-9]+\.[0-9]+\.[0-9]+([-.][0-9A-Za-z]+)*$") {
  throw "Version must look like 1.0.2 or 1.0.2-beta.1"
}

$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$repoRoot = Resolve-Path (Join-Path $scriptDir "..")
Push-Location $repoRoot

try {
  $outputDir = "dist-release-v$Version"
  $setupName = "TRH Development Control Panel Setup $Version.exe"
  $blockmapName = "$setupName.blockmap"
  $setupPath = Join-Path $outputDir $setupName
  $blockmapPath = Join-Path $outputDir $blockmapName

  Write-Output "[release] Running project verification..."
  npm run verify
  if ($LASTEXITCODE -ne 0) {
    throw "Verification failed."
  }

  Write-Output "[release] Generating icons..."
  npm run icons
  if ($LASTEXITCODE -ne 0) {
    throw "Icon generation failed."
  }

  Write-Output "[release] Clearing previous output: $outputDir"
  Remove-Item -Recurse -Force $outputDir -ErrorAction SilentlyContinue

  Write-Output "[release] Building installer $Version..."
  node .\node_modules\electron-builder\cli.js --win --x64 --config.directories.output=$outputDir --config.extraMetadata.version=$Version
  if ($LASTEXITCODE -ne 0) {
    throw "electron-builder failed."
  }

  if (!(Test-Path $setupPath)) {
    throw "Missing expected installer artifact: $setupPath"
  }

  if (!(Test-Path $blockmapPath)) {
    throw "Missing expected blockmap artifact: $blockmapPath"
  }

  $setupHash = (Get-FileHash $setupPath -Algorithm SHA256).Hash
  $blockHash = (Get-FileHash $blockmapPath -Algorithm SHA256).Hash

  @(
    "$setupHash  $setupName",
    "$blockHash  $blockmapName"
  ) | Set-Content (Join-Path $outputDir "SHA256SUMS.txt")

  $dateUtc = (Get-Date).ToUniversalTime().ToString("yyyy-MM-dd HH:mm:ss 'UTC'")
  $headCommit = git rev-parse HEAD

  $commitLines = @()
  if (![string]::IsNullOrWhiteSpace($FromTag)) {
    $commitLines = git log --oneline "$FromTag..HEAD"
    if (-not $commitLines) {
      $commitLines = @("(no commits found in range $FromTag..HEAD)")
    }
  } else {
    $commitLines = git log --oneline -10
  }

  $rangeLabel = if ([string]::IsNullOrWhiteSpace($FromTag)) { "latest" } else { "$FromTag..HEAD" }

  $releaseMd = @(
    "# TRH Development Control Panel v$Version",
    "",
    "Generated: $dateUtc",
    "Head Commit: $headCommit",
    "Commit Range: $rangeLabel",
    "",
    "## Artifacts",
    "- $setupName",
    "- $blockmapName",
    "",
    "## SHA-256",
    "- $setupHash  $setupName",
    "- $blockHash  $blockmapName",
    "",
    "## Commits",
    $commitLines
  )

  $releaseFile = Join-Path $outputDir "GITHUB_RELEASE_v$Version.md"
  $releaseMd | Set-Content $releaseFile

  Write-Output "[release] Completed successfully."
  Write-Output "[release] Output directory: $outputDir"
  Write-Output "[release] Installer: $setupPath"
  Write-Output "[release] Blockmap: $blockmapPath"
  Write-Output "[release] SHA256SUMS: $(Join-Path $outputDir 'SHA256SUMS.txt')"
  Write-Output "[release] Release notes: $releaseFile"
}
finally {
  Pop-Location
}
