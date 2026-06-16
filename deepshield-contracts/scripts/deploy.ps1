# Deploy script for DeepShield AI Move Contracts

Write-Host "Building DeepShield AI Move Contracts..."
sui move build

Write-Host "Publishing to Sui Testnet..."
sui client publish --gas-budget 100000000
