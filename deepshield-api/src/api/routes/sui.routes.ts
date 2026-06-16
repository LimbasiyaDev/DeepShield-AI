import { Router } from 'express';
import { SuiService } from '../../services/sui.service.js';

const router = Router();

router.get('/status', async (req, res, next) => {
  try {
    const status = await SuiService.getNetworkStatus();
    res.json({ success: true, data: status });
  } catch (error) {
    next(error);
  }
});

router.get('/balance/:address', async (req, res, next) => {
  try {
    const balance = await SuiService.getWalletBalance(req.params.address);
    res.json({ success: true, data: balance });
  } catch (error) {
    next(error);
  }
});

export default router;
