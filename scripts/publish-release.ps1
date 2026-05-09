param(
  [Parameter(Mandatory = $true)]
  [string]$Version,
  [string]$Repo = "",
  [switch]$Draft,
  [switch]$Prerelease
)

$ErrorActionPreference = "Stop"

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

$gh = Get-Command gh -ErrorAction SilentlyContinue
if (-not $gh) {
  throw "GitHub CLI (gh) is not installed. Install from https://cli.github.com/"
}

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
  Write-Warning "HEAD ($headCommit) does not match $tag ($tagCommit)."
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

Write-Host "[publish] Pushing tag $tag..."
git push origin $tag
if ($LASTEXITCODE -ne 0) {
  throw "Failed pushing tag $tag to origin."
}

Write-Host "[publish] Creating GitHub release $tag..."
$cmd = @(
  "release", "create", $tag,
  $exeFile,
  $blockmapFile,
  $shaFile,
  "--notes-file", $notesFile,
  "--title", "TRH Development Control Panel $tag"
) + $flags + $repoArg

& gh @cmd
if ($LASTEXITCODE -ne 0) {
  throw "gh release create failed."
}

Write-Host "[publish] Release $tag published successfully."
