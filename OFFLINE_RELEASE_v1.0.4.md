# Offline Release Checklist - v1.0.4

This release can be distributed and installed without GitHub publication.

## Artifact Location

- dist-release-v1.0.4/TRH Development Control Panel Setup 1.0.4.exe
- dist-release-v1.0.4/TRH Development Control Panel Setup 1.0.4.exe.blockmap
- dist-release-v1.0.4/SHA256SUMS.txt
- dist-release-v1.0.4/GITHUB_RELEASE_v1.0.4.md

## Reference SHA-256

- 557CD24B8BC6DD69CD0C7239719809A2E99935C06E19C3D3B072948D0DF3BF27  TRH Development Control Panel Setup 1.0.4.exe
- 5F362B88152C24E347ACDDEFA5D26992616F3021168988B9FC2CD83CEE9C2D19  TRH Development Control Panel Setup 1.0.4.exe.blockmap

## Verification Commands (PowerShell)

Run from repo root:

Get-FileHash "dist-release-v1.0.4/TRH Development Control Panel Setup 1.0.4.exe" -Algorithm SHA256
Get-FileHash "dist-release-v1.0.4/TRH Development Control Panel Setup 1.0.4.exe.blockmap" -Algorithm SHA256
Get-Content "dist-release-v1.0.4/SHA256SUMS.txt"

## Rebuild Command (Offline)

powershell -ExecutionPolicy Bypass -File ./scripts/release-build.ps1 -Version 1.0.4

Expected result:

- Exit code 0
- Installer, blockmap, checksums, and release notes regenerated in dist-release-v1.0.4

## Install Command (Windows)

Start-Process "dist-release-v1.0.4/TRH Development Control Panel Setup 1.0.4.exe"

## Operational Validation

After install/start:

- Open http://localhost:3000
- Health probe: Invoke-WebRequest -Uri "http://localhost:3000/api/health" -UseBasicParsing
- Verify endpoint status code is 200

## Notes

- GitHub publish is optional and currently not required for this offline release path.
- If publication is needed later, use scripts/publish-release.ps1 after GH authentication is configured.
