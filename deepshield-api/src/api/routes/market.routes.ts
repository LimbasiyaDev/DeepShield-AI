import { Router } from 'express';
import { DeepBookService } from '../../services/deepbook.service.js';
import { intelligenceData } from '../../utils/mockData.js';

const router = Router();

router.get('/tokens', async (req, res, next) => {
  try {
    const markets = await DeepBookService.getMarkets();
    res.json({ success: true, data: markets });
  } catch (error) {
    next(error);
  }
});

router.get('/:token', async (req, res, next) => {
  try {
    const liquidity = await DeepBookService.getLiquidity(req.params.token);
    res.json({ success: true, data: liquidity });
  } catch (error) {
    next(error);
  }
});

import { WalrusService } from '../../walrus/walrus.service.js';
import { MoveService } from '../../sui/move.service.js';
import { VerificationService } from '../../verification/verification.service.js';
import { AIMarketService } from '../../services/ai-market.service.js';
import { prisma } from '../../database/prisma.js';

router.get('/:token/analysis', async (req, res, next) => {
  try {
    const token = req.params.token;
    
    // 1. Call real Groq LLM for market analysis
    const aiResult = await AIMarketService.analyzeToken({ token });
    
    // Fallback if AI fails completely
    const reportData = {
      sentiment: aiResult.sentiment || 'Neutral',
      confidence: aiResult.confidence || 50,
      expectedMove: aiResult.expectedMove || '0%',
      recommendation: aiResult.recommendation || 'No clear recommendation.',
      riskScore: 100 - (aiResult.confidence || 50)
    };

    const fallbackWallet = process.env.SUI_PRIVATE_KEY ? '0x0288094852c5254052abd0c431915f883eee0c8372807f099506864749d30c6d' : '0x0';
    const recipient = req.query.wallet as string || fallbackWallet;

    // 1.5 Save to local Prisma DB
    await prisma.riskReport.create({
      data: {
        walletAddress: recipient,
        tokenPair: token,
        riskScore: reportData.riskScore,
        mevProbability: Math.random() * 20, // Mocking these specific metrics as they require more complex blockchain indexing
        liquidityScore: 85,
        volatilityScore: 40,
        whaleScore: 10,
        recommendation: reportData.recommendation
      }
    });
    
    // 2. Upload to Walrus
    const walrusResult = await WalrusService.uploadMarketAnalysis(reportData);

    // 3. Store Reference in Move
    const suiResult = await MoveService.saveMarketAnalysis(
      recipient,
      token,
      reportData.sentiment,
      reportData.confidence,
      walrusResult.blobId
    );

    // 4. Verify
    const verification = await VerificationService.verifyRiskReport(
      suiResult.objectId,
      walrusResult.blobId,
      suiResult.txHash
    );

    res.json({
      success: true,
      data: {
        aiAnalysis: reportData,
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
