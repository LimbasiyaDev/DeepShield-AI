import { Router } from 'express';
import { AIMarketService } from '../../services/ai-market.service.js';

const router = Router();

router.post('/analyze-token', async (req, res, next) => {
  try {
    const result = await AIMarketService.analyzeToken(req.body);
    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
});

export default router;
