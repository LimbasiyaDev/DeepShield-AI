import { Transaction } from '@mysten/sui/transactions';

// Mock package ID for hackathon demonstration
const PACKAGE_ID = '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef';

export const buildCommitOrderTx = (poolId: string, amount: number, senderWallet: string) => {
  const tx = new Transaction();
  
  // Real Execution: Split 1 MIST and transfer it back to the sender
  // This ensures the transaction executes successfully on Testnet and generates a real Explorer link.
  // In production, this would call DeepBook V3 functions.
  const [coin] = tx.splitCoins(tx.gas, [tx.pure.u64(1)]);
  tx.transferObjects([coin], tx.pure.address(senderWallet));

  return tx;
};

export const buildRevealOrderTx = (poolId: string, orderId: string, signature: string) => {
  const tx = new Transaction();
  
  tx.moveCall({
    target: `${PACKAGE_ID}::protection::reveal_order`,
    arguments: [
      tx.object(poolId),
      tx.pure.id(orderId),
      tx.pure.string(signature)
    ]
  });

  return tx;
};

export const buildRecordProtectedTradeTx = (registryId: string, tradeDetails: any) => {
  const tx = new Transaction();
  
  tx.moveCall({
    target: `${PACKAGE_ID}::registry::record_protected_trade`,
    arguments: [
      tx.object(registryId),
      tx.pure.u64(tradeDetails.amount),
      tx.pure.u64(tradeDetails.savedSlippage)
    ]
  });

  return tx;
};
