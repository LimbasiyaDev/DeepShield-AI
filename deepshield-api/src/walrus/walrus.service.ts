import axios from 'axios';

export interface WalrusResponse {
  blobId: string;
  blobUrl: string;
  timestamp: number;
  status: 'Stored' | 'Failed' | 'Fallback';
  message?: string;
}

class AsyncSemaphore {
  private queue: (() => void)[] = [];
  private activeCount = 0;
  constructor(private maxConcurrent: number) {}

  async acquire(): Promise<void> {
    if (this.activeCount < this.maxConcurrent) {
      this.activeCount++;
      return Promise.resolve();
    }
    return new Promise(resolve => {
      this.queue.push(resolve);
    });
  }

  release(): void {
    if (this.queue.length > 0) {
      const resolve = this.queue.shift();
      if (resolve) resolve();
    } else {
      this.activeCount--;
    }
  }
}

export class WalrusService {
  private static publisherUrl = process.env.WALRUS_PUBLISHER_URL || 'https://publisher.walrus-testnet.walrus.space';
  private static aggregatorUrl = process.env.WALRUS_AGGREGATOR_URL || 'https://aggregator.walrus-testnet.walrus.space';
  
  // Static Fallback Cache for when Walrus network is unavailable
  private static fallbackCache = new Map<string, any>();
  
  // Restrict concurrent uploads to avoid rate limits or congestion
  private static uploadQueue = new AsyncSemaphore(5);

  private static delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private static async executeWithRetry<T>(
    operation: () => Promise<T>,
    maxRetries: number = 3,
    baseDelayMs: number = 1000
  ): Promise<T> {
    let attempt = 0;
    while (attempt < maxRetries) {
      try {
        return await operation();
      } catch (error) {
        attempt++;
        if (attempt >= maxRetries) {
          throw error;
        }
        // Exponential backoff
        const delayMs = baseDelayMs * Math.pow(2, attempt - 1);
        console.warn(`[WalrusService] Attempt ${attempt} failed. Retrying in ${delayMs}ms...`);
        await this.delay(delayMs);
      }
    }
    throw new Error("Unreachable");
  }

  private static async uploadJson(data: any, epochs: number = 5): Promise<WalrusResponse> {
    await this.uploadQueue.acquire();
    
    try {
      const jsonString = JSON.stringify(data);
      const url = `${this.publisherUrl}/v1/store?epochs=${epochs}`;

      return await this.executeWithRetry(async () => {
        // Upload with a 10s timeout
        const response = await axios.put(url, jsonString, {
          headers: { 'Content-Type': 'application/json' },
          timeout: 10000 
        });
        
        const resData = response.data;
        let blobId = '';
        
        if (resData.alreadyCertified) {
          blobId = resData.alreadyCertified.blobId;
        } else if (resData.newlyCreated) {
          blobId = resData.newlyCreated.blobObject.blobId;
        } else {
          throw new Error('Unexpected response format from Walrus Publisher');
        }

        // Verify blob accessibility immediately
        const isAccessible = await this.verifyBlob(blobId);
        if (!isAccessible) {
          console.warn(`[WalrusService] Blob ${blobId} uploaded but verification failed. Proceeding anyway, it may be propagating.`);
        }

        return {
          blobId,
          blobUrl: `${this.aggregatorUrl}/v1/${blobId}`,
          timestamp: Date.now(),
          status: 'Stored',
          message: 'Stored securely on Walrus'
        };
      }, 3, 1500); // 3 retries, starting at 1.5s delay
      
    } catch (error: any) {
      console.error('[WalrusService] ❌ Walrus Upload completely failed after retries. Storing in Fallback Cache.', error?.message || error);
      
      const fallbackId = 'fallback_blob_' + Date.now();
      this.fallbackCache.set(fallbackId, data);
      
      return {
        blobId: fallbackId,
        blobUrl: `/api/fallback/${fallbackId}`, // Internal route for UI if needed, though we intercept it in getBlob
        timestamp: Date.now(),
        status: 'Fallback',
        message: 'Network congested. Saved to Local Fallback Cache.'
      };
    } finally {
      this.uploadQueue.release();
    }
  }

  static async uploadRiskReport(report: any): Promise<WalrusResponse> {
    return this.uploadJson({ type: 'RiskReport', ...report });
  }

  static async uploadMarketAnalysis(analysis: any): Promise<WalrusResponse> {
    return this.uploadJson({ type: 'MarketAnalysis', ...analysis });
  }

  static async uploadProtectionReplay(replay: any): Promise<WalrusResponse> {
    return this.uploadJson({ type: 'ProtectionReplay', ...replay });
  }

  static async uploadPortfolioAnalysis(analysis: any): Promise<WalrusResponse> {
    return this.uploadJson({ type: 'PortfolioAnalysis', ...analysis });
  }

  static async uploadWhaleReport(report: any): Promise<WalrusResponse> {
    return this.uploadJson({ type: 'WhaleReport', ...report });
  }

  static async uploadSimulationResult(result: any): Promise<WalrusResponse> {
    return this.uploadJson({ type: 'SimulationResult', ...result });
  }

  static async getBlob(blobId: string): Promise<any> {
    if (blobId.startsWith('fallback_blob_')) {
      return this.fallbackCache.get(blobId) || null;
    }

    try {
      const response = await axios.get(`${this.aggregatorUrl}/v1/${blobId}`, { timeout: 10000 });
      return response.data;
    } catch (error) {
      console.error(`[WalrusService] Failed to retrieve blob ${blobId}:`, error);
      return null;
    }
  }

  static async verifyBlob(blobId: string): Promise<boolean> {
    if (blobId.startsWith('fallback_blob_')) {
      return this.fallbackCache.has(blobId);
    }

    try {
      // Fast timeout for verification
      await axios.head(`${this.aggregatorUrl}/v1/${blobId}`, { timeout: 3000 });
      return true;
    } catch (error) {
      return false;
    }
  }
}
