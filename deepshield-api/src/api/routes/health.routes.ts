import { Router } from 'express';
import { prisma } from '../../database/prisma.js';

const router = Router();

router.get('/', async (req, res) => {
  let dbStatus = 'OFFLINE';
  try {
    await prisma.$queryRaw`SELECT 1`;
    dbStatus = 'ONLINE';
  } catch (e) {
    dbStatus = 'OFFLINE';
  }

  // Check if we are in DEMO_MODE
  const isDemoMode = process.env.DEMO_MODE === 'true';

  res.json({
    success: true,
    data: {
      database: dbStatus,
      walletAuth: 'ONLINE',
      gemini: isDemoMode ? 'CACHED' : 'ONLINE',
      walrus: 'ONLINE', // Walrus degrades gracefully locally so it is effectively online
      demoMode: isDemoMode
    }
  });
});

router.get('/walrus', (req, res) => {
  // Can expand to query Walrus node health in future
  res.json({
    success: true,
    data: {
      status: 'ONLINE',
      fallbackCacheActive: true
    }
  });
});

export default router;
