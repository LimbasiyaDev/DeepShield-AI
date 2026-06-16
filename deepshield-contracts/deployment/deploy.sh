#!/bin/bash

# DeepShield AI - Move Contract Deployment Script
# This script builds and publishes the Move contracts to the active Sui network.

echo "==========================================="
echo "  DeepShield AI - Sui Contract Deployment  "
echo "==========================================="

# Check for Sui CLI
if ! command -v sui &> /dev/null; then
    echo "ERROR: Sui CLI is not installed or not in PATH."
    echo "Please install from: https://docs.sui.io/guides/developer/getting-started/sui-install"
    exit 1
fi

echo "1. Building Move Contracts..."
sui move build

if [ $? -ne 0 ]; then
    echo "ERROR: Move build failed."
    exit 1
fi

echo "2. Publishing to Sui Network..."
echo "Using Gas Budget: 100000000 MIST"

# Capture output of publish command to extract Package ID
PUBLISH_OUTPUT=$(sui client publish --gas-budget 100000000 --json)

if [ $? -ne 0 ]; then
    echo "ERROR: Contract publishing failed."
    echo "$PUBLISH_OUTPUT"
    exit 1
fi

echo "Deployment Successful!"
echo "Please inspect the JSON output to retrieve your Package ID and update the deployment-config.json file."
echo "$PUBLISH_OUTPUT" > publish-output.json
echo "Saved raw output to publish-output.json"

exit 0
