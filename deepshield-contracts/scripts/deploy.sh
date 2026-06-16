#!/bin/bash
# Deploy script for DeepShield AI Move Contracts

echo "Building DeepShield AI Move Contracts..."
sui move build

echo "Publishing to Sui Testnet..."
sui client publish --gas-budget 100000000
