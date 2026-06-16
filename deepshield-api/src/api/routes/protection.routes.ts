import { Router } from 'express';
import { ProtectionService } from '../../services/protection.service.js';
import { WalrusService } from '../../walrus/walrus.service.js';
import { MoveService } from '../../sui/move.service.js';
import { VerificationService } from '../../verification/verification.service.js';

const router = Router();

router.post('/analyze', async (req, res, next) => {
  try {
    const { pair, amount, slippage, wallet } = req.body;
    const result = await ProtectionService.analyze(pair, amount, slippage, wallet);
    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
});

router.post('/execute', async (req, res, next) => {
  try {
    const { pair, amount, slippage, wallet } = req.body;
    
    // 1. Analyze and execute (mocked execution)
    const execResult: any = await ProtectionService.execute(req.body);
    
    // 2. Upload to Walrus
    const walrusResult = await WalrusService.uploadProtectionReplay({
      request: req.body,
      execution: execResult
    });

    // 3. Store Protection Proof and Record on Sui
    const recipient = wallet || '0x0288094852c5254052abd0c431915f883eee0c8372807f099506864749d30c6d';
    
    const proofResult = await MoveService.createProtectionProof(
      recipient,
      pair || 'SUI/USDC',
      execResult.riskScore || 50,
      execResult.strategy || 'Direct Execution',
      execResult.estimatedSavings || '$0.00',
      walrusResult.blobId
    );

    await MoveService.recordProtection(
      recipient,
      pair || 'SUI/USDC',
      execResult.strategy || 'Direct Execution',
      execResult.estimatedSavings || '$0.00',
      execResult.actualSavings || '$0.00',
      walrusResult.blobId
    );

    // 4. Verify
    const verification = await VerificationService.verifyProtectionProof(
      proofResult.objectId,
      walrusResult.blobId,
      proofResult.txHash
    );

    res.json({ 
      success: true, 
      data: {
        ...execResult,
        verification: {
          ...verification,
          walrusStatus: walrusResult.status,
          walrusMessage: walrusResult.message
        }
      }
    });
  } catch (error) {
    next(error);
  }
});

export default router;
