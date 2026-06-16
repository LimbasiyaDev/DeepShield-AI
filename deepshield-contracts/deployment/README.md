# DeepShield AI Move Contract Deployment

This directory contains the automation scripts to deploy the DeepShield AI smart contracts to the Sui network.

## Prerequisites

1. **Sui CLI installed**: Follow the official guide at [docs.sui.io](https://docs.sui.io/guides/developer/getting-started/sui-install)
2. **Active Environment**: Ensure your active Sui environment is set to `testnet` (or your target network).
   ```bash
   sui client envs
   sui client switch --env testnet
   ```
3. **Funded Address**: The active address needs enough SUI to cover the 100M MIST gas budget.
   ```bash
   sui client active-address
   sui client gas
   ```

## Deployment

Choose the script that matches your operating system.

### Windows (PowerShell)
```powershell
.\deploy.ps1
```

### Linux / macOS (Bash)
```bash
chmod +x deploy.sh
./deploy.sh
```

## Post-Deployment Configuration

1. The script will generate a `publish-output.json` file.
2. Open the file and locate the `"publishedAt"` field or the list of `"created"` objects to find your **Package ID**.
3. Locate the specific object IDs for the shared registries created during the `init` function (e.g., `RiskRegistry`, `ProtectionRegistry`).
4. Update `deployment-config.json` with these IDs.
5. Copy these values to your `deepshield-api/.env` file to fully connect the backend to your live Move contracts!
