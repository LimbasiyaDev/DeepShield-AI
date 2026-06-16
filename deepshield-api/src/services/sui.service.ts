import { getFullnodeUrl, SuiClient } from '@mysten/sui/client';

const rpcUrl = process.env.SUI_RPC_URL || getFullnodeUrl('mainnet');
const client = new SuiClient({ url: rpcUrl });

export class SuiService {
  static async getWalletBalance(address: string) {
    try {
      const balance = await client.getBalance({ owner: address });
      return balance;
    } catch (error) {
      console.error('Error fetching Sui balance:', error);
      throw new Error('Failed to fetch wallet balance');
    }
  }

  static async getWalletAssets(address: string) {
    try {
      const coins = await client.getAllCoins({ owner: address });
      return coins.data;
    } catch (error) {
      console.error('Error fetching Sui assets:', error);
      throw new Error('Failed to fetch wallet assets');
    }
  }

  static async getTransaction(digest: string) {
    try {
      const tx = await client.getTransactionBlock({
        digest,
        options: { showEffects: true, showEvents: true, showInput: true },
      });
      return tx;
    } catch (error) {
      console.error('Error fetching transaction:', error);
      throw new Error('Failed to fetch transaction');
    }
  }

  static async submitTransaction(signedTxBytes: string, signature: string) {
    try {
      const result = await client.executeTransactionBlock({
        transactionBlock: signedTxBytes,
        signature: signature,
        options: { showEffects: true },
      });
      return result;
    } catch (error) {
      console.error('Error submitting transaction:', error);
      throw new Error('Failed to submit transaction');
    }
  }

  static async getNetworkStatus() {
    try {
      const latestCheckpoint = await client.getLatestCheckpointSequenceNumber();
      return { status: 'Operational', latestCheckpoint };
    } catch (error) {
      return { status: 'Degraded' };
    }
  }

  static async getWalletHistory(address: string) {
    try {
      const history = await client.queryTransactionBlocks({
        filter: { FromAddress: address },
        options: { showEffects: true },
      });
      return history.data;
    } catch (error) {
      console.error('Error fetching wallet history:', error);
      throw new Error('Failed to fetch wallet history');
    }
  }
}
