import { Router } from 'express';
import { volumeData, riskDistribution, recentTrades, leaderboardData } from '../../utils/mockData.js';

const router = Router();

router.get('/dashboard', (req, res) => {
  res.json({
    success: true,
    data: {
      volumeData,
      riskDistribution,
      recentTrades,
      leaderboardData
    }
  });
});

export default router;
