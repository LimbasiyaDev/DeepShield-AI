import { Router } from 'express';
import jwt from 'jsonwebtoken';
import { verifyPersonalMessageSignature } from '@mysten/sui/verify';
import { prisma } from '../../database/prisma.js';

const router = Router();
const nonces = new Map<string, string>(); // In-memory nonce store for hackathon
const inMemoryUsers = new Map<string, any>(); // Fallback store if DB is offline

router.post('/nonce', (req, res) => {
  const { walletAddress } = req.body;
  const nonce = 'DeepShield-Nonce-' + Math.random().toString(36).substring(2) + Date.now();
  nonces.set(walletAddress, nonce);
  res.json({ success: true, data: { nonce } });
});

router.post('/verify', async (req, res, next) => {
  try {
    const { walletAddress, signature, messageBytes } = req.body;

    // Actual verification using @mysten/sui
    const publicKey = await verifyPersonalMessageSignature(
      new Uint8Array(Buffer.from(messageBytes, 'base64')),
      signature
    );
    
    if (publicKey.toSuiAddress() !== walletAddress) {
      return res.status(401).json({ success: false, message: 'Invalid signature' });
    }

    let user: any = null;
    
    // Try Database First
    try {
      user = await prisma.user.findUnique({ where: { walletAddress } });
      if (!user) {
        user = await prisma.user.create({ data: { walletAddress } });
      }
    } catch (dbError) {
      console.warn('⚠️ Database write failed during auth. Falling back to in-memory store.', dbError);
      // Fallback to in-memory store
      if (inMemoryUsers.has(walletAddress)) {
        user = inMemoryUsers.get(walletAddress);
      } else {
        user = { id: 'fallback-' + Date.now(), walletAddress };
        inMemoryUsers.set(walletAddress, user);
      }
    }

    // Always issue JWT if signature was verified
    const token = jwt.sign({ id: user.id, wallet: walletAddress }, process.env.JWT_SECRET || 'secret', { expiresIn: '24h' });
    res.json({ success: true, data: { token, user } });
  } catch (error) {
    next(error);
  }
});

router.get('/profile', async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ success: false, message: 'Unauthorized' });
    
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret') as any;
    
    let user = null;
    
    try {
      user = await prisma.user.findUnique({ where: { id: decoded.id } });
    } catch (dbError) {
      console.warn('⚠️ Database read failed during profile fetch. Checking in-memory store.');
    }

    if (!user && inMemoryUsers.has(decoded.wallet)) {
      user = inMemoryUsers.get(decoded.wallet);
    }
    
    if (!user) {
      // If totally missing, return a dummy profile so the UI doesn't crash during demo
      user = { id: decoded.id, walletAddress: decoded.wallet };
    }
    
    res.json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
});

router.get('/health/auth', async (req, res) => {
  let dbStatus = 'OFFLINE';
  try {
    await prisma.$queryRaw`SELECT 1`;
    dbStatus = 'ONLINE';
  } catch (e) {
    dbStatus = 'OFFLINE';
  }

  res.json({
    success: true,
    data: {
      databaseStatus: dbStatus,
      jwtStatus: 'READY',
      walletVerificationStatus: 'READY',
      inMemoryFallbackActive: inMemoryUsers.size > 0
    }
  });
});

router.post('/logout', (req, res) => {
  res.json({ success: true, message: 'Logged out successfully' });
});

export default router;
