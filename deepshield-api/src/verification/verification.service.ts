import { WalrusService } from '../walrus/walrus.service.js';
import { SuiClient, getFullnodeUrl } from '@mysten/sui/client';

const client = new SuiClient({ url: getFullnodeUrl('testnet') });

export interface VerificationResult {
  verified: boolean;
  objectId?: string;
  blobId?: string;
  txHash?: string;
  explorerUrl?: string;
  walrusUrl?: string;
  timestamp: number;
}

export class VerificationService {
  static async verifyBlob(blobId: string): Promise<boolean> {
    return WalrusService.verifyBlob(blobId);
  }

  static async verifyObject(objectId: string): Promise<boolean> {
    if (!objectId || objectId.startsWith('pending') || objectId.startsWith('mock_')) return false;
    try {
      const res = await client.getObject({ id: objectId });
      return res.data !== null && res.data !== undefined;
    } catch {
      return false;
    }
  }

  static async verifyProtectionProof(objectId: string, blobId: string, txHash: string): Promise<VerificationResult> {
    const isBlobValid = await this.verifyBlob(blobId);
    const isObjectValid = await this.verifyObject(objectId);

    const walrusUrl = blobId.startsWith('fallback_blob_') 
      ? `local-cache://${blobId}`
      : `${process.env.WALRUS_AGGREGATOR_URL || 'https://aggregator.walrus-testnet.walrus.space'}/v1/${blobId}`;

    return {
      verified: isBlobValid && isObjectValid,
      objectId,
      blobId,
      txHash,
      explorerUrl: `https://suiscan.xyz/testnet/object/${objectId}`,
      walrusUrl,
      timestamp: Date.now()
    };
  }

  static async verifyRiskReport(objectId: string, blobId: string, txHash: string): Promise<VerificationResult> {
    return this.verifyProtectionProof(objectId, blobId, txHash);
  }

  static async verifyPortfolioAnalysis(objectId: string, blobId: string, txHash: string): Promise<VerificationResult> {
    return this.verifyProtectionProof(objectId, blobId, txHash);
  }
}
