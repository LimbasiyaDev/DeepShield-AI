import { Router } from 'express';
import { RiskService } from '../../services/risk.service.js';

const router = Router();

router.post('/calculate', async (req, res, next) => {
  try {
    const risk = await RiskService.calculateRisk(req.body);
    res.json({ success: true, data: risk });
  } catch (error) {
    next(error);
  }
});

export default router;
