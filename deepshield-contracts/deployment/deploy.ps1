<#
.SYNOPSIS
DeepShield AI - Move Contract Deployment Script

.DESCRIPTION
This script builds and publishes the Move contracts to the active Sui network.
#>

Write-Host "===========================================" -ForegroundColor Cyan
Write-Host "  DeepShield AI - Sui Contract Deployment  " -ForegroundColor Cyan
Write-Host "===========================================" -ForegroundColor Cyan

# Check for Sui CLI
if (-not (Get-Command "sui" -ErrorAction SilentlyContinue)) {
    Write-Host "ERROR: Sui CLI is not installed or not in PATH." -ForegroundColor Red
    Write-Host "Please install from: https://docs.sui.io/guides/developer/getting-started/sui-install" -ForegroundColor Yellow
    exit 1
}

Write-Host "1. Building Move Contracts..." -ForegroundColor Cyan
sui move build

if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: Move build failed." -ForegroundColor Red
    exit 1
}

Write-Host "2. Publishing to Sui Network..." -ForegroundColor Cyan
Write-Host "Using Gas Budget: 100000000 MIST" -ForegroundColor Cyan

$publishOutput = sui client publish --gas-budget 100000000 --json

if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: Contract publishing failed." -ForegroundColor Red
    Write-Host $publishOutput
    exit 1
}

Write-Host "Deployment Successful!" -ForegroundColor Green
Write-Host "Please inspect the JSON output to retrieve your Package ID and update the deployment-config.json file." -ForegroundColor Yellow
$publishOutput | Out-File -FilePath "publish-output.json" -Encoding utf8
Write-Host "Saved raw output to publish-output.json" -ForegroundColor Green

exit 0
