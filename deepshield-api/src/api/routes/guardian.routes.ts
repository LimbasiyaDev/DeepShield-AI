import { Router } from 'express';
import { GuardianService } from '../../services/guardian.service.js';

const router = Router();

router.post('/chat', async (req, res, next) => {
  try {
    const { question, context } = req.body;
    const result = await GuardianService.chat(question, context);
    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
});

export default router;
