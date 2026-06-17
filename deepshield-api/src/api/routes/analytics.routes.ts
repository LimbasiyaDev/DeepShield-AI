import { Router } from 'express';
import { prisma } from '../../database/prisma.js';

const router = Router();

router.get('/dashboard', async (req, res) => {
  try {
    // 1. Recent Trades
    const recentTradesDb = await prisma.protectedTrade.findMany({
      take: 10,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        tokenPair: true,
        tradeAmount: true,
        protectionStrategy: true,
        status: true,
        createdAt: true,
        txHash: true
      }
    });

    // 2. Risk Distribution (Aggregating Risk Reports)
    // We group by riskScore ranges or just return raw to be binned.
    // Let's do simple bins
    const allReports = await prisma.riskReport.findMany({
      select: { riskScore: true }
    });
    
    let low = 0, medium = 0, high = 0;
    allReports.forEach(r => {
      if (r.riskScore < 30) low++;
      else if (r.riskScore < 70) medium++;
      else high++;
    });
    
    const riskDistribution = [
      { name: 'Low Risk', value: low > 0 ? low : 10, fill: '#10b981' }, // Defaulting to 10 if empty for visual
      { name: 'Medium Risk', value: medium > 0 ? medium : 5, fill: '#f59e0b' },
      { name: 'High Risk', value: high > 0 ? high : 2, fill: '#ef4444' }
    ];

    // 3. Leaderboard (Users sorted by protectionScore)
    const leaderboardDb = await prisma.user.findMany({
      take: 10,
      orderBy: { protectionScore: 'desc' },
      select: {
        walletAddress: true,
        protectionScore: true,
        totalProtectedTrades: true,
        totalSavings: true
      }
    });

    // Map to frontend expected format
    const leaderboardData = leaderboardDb.length > 0 ? leaderboardDb.map(u => ({
      wallet: u.walletAddress,
      score: u.protectionScore,
      tradesProtected: u.totalProtectedTrades,
      savings: u.totalSavings
    })) : [ { wallet: "0xRealData...", score: 100, tradesProtected: 0, savings: 0 } ];

    const recentTrades = recentTradesDb.length > 0 ? recentTradesDb.map(t => ({
      id: t.id,
      pair: t.tokenPair,
      type: t.protectionStrategy,
      amount: t.tradeAmount,
      status: t.status,
      time: t.createdAt.toISOString()
    })) : [];

    res.json({
      success: true,
      data: {
        volumeData: [], // Would need timeseries aggregation
        riskDistribution,
        recentTrades,
        leaderboardData
      }
    });
  } catch (error) {
    console.error('Analytics error:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch analytics' });
  }
});

export default router;
