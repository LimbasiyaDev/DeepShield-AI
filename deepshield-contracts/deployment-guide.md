# DeepShield AI Move Contracts Deployment Guide

## Prerequisites
1. Ensure you have the [Sui CLI installed](https://docs.sui.io/guides/developer/getting-started/sui-install).
2. Set your environment to Sui Testnet:
   ```bash
   sui client envs
   sui client switch --env testnet
   ```
3. Ensure you have testnet SUI in your active address:
   ```bash
   sui client faucet
   ```

## Deployment
Run the deployment script from the `deepshield-contracts` folder:

### Linux/macOS
```bash
./scripts/deploy.sh
```

### Windows (PowerShell)
```powershell
.\scripts\deploy.ps1
```

## Post-Deployment Configuration
After a successful deployment, the Sui CLI will output a transaction summary. Look for the `Published Objects` section.

You need to copy the `Package ID` and update the `deepshield-api/.env` file:
```env
PACKAGE_ID=0x...
```

Since the DeepShield structs do not require shared objects upon initialization (they are created on demand and transferred to the user), the only hardcoded requirement for the backend is the `PACKAGE_ID`. The backend will dynamically create the `RiskReport`, `ProtectionRecord`, `MarketIntelligence`, `PortfolioAnalysis`, and `ProtectionProof` objects and return the IDs.
