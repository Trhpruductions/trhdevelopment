param(
  [Parameter(Mandatory = $true)]
  [string]$Version,
  [string]$Repo = "",
  [switch]$Draft,
  [switch]$Prerelease
)

$ErrorActionPreference = "Stop"

# In PowerShell 7+, native command stderr can be promoted to Error records and
# terminate script execution when ErrorActionPreference is Stop. Disable this
# behavior so non-fatal tool warnings do not fail release automation.
if (Get-Variable -Name PSNativeCommandUseErrorActionPreference -ErrorAction SilentlyContinue) {
  $PSNativeCommandUseErrorActionPreference = $false
}

function Resolve-GhExecutable {
  $globalGh = Get-Command gh -ErrorAction SilentlyContinue
  if ($globalGh) {
    return $globalGh.Path
  }

  $portableGh = Join-Path (Resolve-Path (Join-Path $PSScriptRoot "..")) "tools/gh/bin/gh.exe"
  if (Test-Path $portableGh) {
    return $portableGh
  }

  return $null
}

function Confirm-GhAuth([string]$GhExe) {
  # Non-interactive token auth path for CI/local automation.
  $token = if ($env:GH_TOKEN) { $env:GH_TOKEN } elseif ($env:GITHUB_TOKEN) { $env:GITHUB_TOKEN } else { $null }
  if ($token) {
    $env:GH_TOKEN = $token
    return
  }

  try {
    & $GhExe auth status 2>$null | Out-Null
  }
  catch {
    Write-Verbose "GitHub auth status check returned an error; validating via exit code."
  }
  if ($LASTEXITCODE -eq 0) {
    return
  }

  throw "GitHub CLI is not authenticated. Run '$GhExe auth login' or set GH_TOKEN/GITHUB_TOKEN with repo scope."
}

if ($Version -notmatch "^[0-9]+\.[0-9]+\.[0-9]+([-.][0-9A-Za-z]+)*$") {
  throw "Version must look like 1.0.3 or 1.0.3-beta.1"
}

$tag = "v$Version"
$releaseDir = "dist-release-v$Version"
$notesFile = Join-Path $releaseDir "GITHUB_RELEASE_v$Version.md"
$exeFile = Join-Path $releaseDir "TRH Development Control Panel Setup $Version.exe"
$blockmapFile = "$exeFile.blockmap"
$shaFile = Join-Path $releaseDir "SHA256SUMS.txt"

if (!(Test-Path $releaseDir)) {
  throw "Missing release directory: $releaseDir"
}

foreach ($requiredFile in @($notesFile, $exeFile, $blockmapFile, $shaFile)) {
  if (!(Test-Path $requiredFile)) {
    throw "Missing required release file: $requiredFile"
  }
}

$ghExe = Resolve-GhExecutable
if (-not $ghExe) {
  throw "GitHub CLI not found. Install gh globally or place portable gh at tools/gh/bin/gh.exe"
}

Confirm-GhAuth -GhExe $ghExe

$remote = git remote get-url origin 2>$null
if (-not $remote) {
  throw "No git remote named origin is configured. Add one with: git remote add origin <url>"
}

$tagCommit = git rev-list -n 1 $tag 2>$null
if (-not $tagCommit) {
  throw "Tag $tag does not exist. Create it first."
}

$headCommit = git rev-parse HEAD
if ($headCommit -ne $tagCommit) {
  Write-Output "[publish] WARNING: HEAD ($headCommit) does not match $tag ($tagCommit)."
}

$repoArg = @()
if (-not [string]::IsNullOrWhiteSpace($Repo)) {
  $repoArg = @("--repo", $Repo)
}

$flags = @()
if ($Draft) {
  $flags += "--draft"
}
if ($Prerelease) {
  $flags += "--prerelease"
}

Write-Output "[publish] Pushing tag $tag..."
git push origin $tag
if ($LASTEXITCODE -ne 0) {
  throw "Failed pushing tag $tag to origin."
}

Write-Output "[publish] Creating GitHub release $tag..."
$cmd = @(
  "release", "create", $tag,
  $exeFile,
  $blockmapFile,
  $shaFile,
  "--notes-file", $notesFile,
  "--title", "TRH Development Control Panel $tag"
) + $flags + $repoArg

& $ghExe @cmd
if ($LASTEXITCODE -ne 0) {
  throw "gh release create failed."
}

Write-Output "[publish] Release $tag published successfully."
