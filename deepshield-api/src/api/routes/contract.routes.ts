import { Router } from 'express';
import { ContractService } from '../../services/contract.service.js';

const router = Router();

router.post('/commit', async (req, res, next) => {
  try {
    const result = await ContractService.commitOrder(req.body);
    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
});

router.post('/record', async (req, res, next) => {
  try {
    const result = await ContractService.recordProtection(req.body);
    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
});

export default router;
