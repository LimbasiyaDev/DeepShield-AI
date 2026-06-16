import { Router } from 'express';
import { replayTrades } from '../../utils/mockData.js';
import { WalrusService } from '../../walrus/walrus.service.js';
import { MoveService } from '../../sui/move.service.js';
import { VerificationService } from '../../verification/verification.service.js';

const router = Router();

router.get('/history', async (req, res, next) => {
  try {
    // In a real app we would fetch the list of protection proofs from Sui RPC or our indexer
    // For the hackathon, we take the mock replays and generate verification data on the fly
    const dataWithVerification = await Promise.all(replayTrades.map(async (trade) => {
      // Mock upload/reference generation for existing mock data
      const mockBlobId = 'mock_blob_' + Math.random().toString(36).substring(2) + Date.now();
      const mockObjectId = `0x${Math.random().toString(16).substring(2, 18)}...${Math.random().toString(16).substring(2, 18)}`;
      const mockTxHash = `${Math.random().toString(36).substring(2, 15)}...`;

      const verification = await VerificationService.verifyProtectionProof(
        mockObjectId,
        mockBlobId,
        mockTxHash
      );

      return {
        ...trade,
        verification
      };
    }));

    res.json({ success: true, data: dataWithVerification });
  } catch (error) {
    next(error);
  }
});

router.get('/:tradeId', (req, res) => {
  const trade = replayTrades.find(t => t.id === req.params.tradeId) || replayTrades[0];
  res.json({ success: true, data: trade });
});

export default router;
