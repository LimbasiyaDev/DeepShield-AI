import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { createServer } from 'http';
import { Server } from 'socket.io';
import dotenv from 'dotenv';
import authRoutes from './api/routes/auth.routes.js';
import suiRoutes from './api/routes/sui.routes.js';
import marketRoutes from './api/routes/market.routes.js';
import aiRoutes from './api/routes/ai.routes.js';
import protectionRoutes from './api/routes/protection.routes.js';
import riskRoutes from './api/routes/risk.routes.js';
import whaleRoutes from './api/routes/whale.routes.js';
import portfolioRoutes from './api/routes/portfolio.routes.js';
import guardianRoutes from './api/routes/guardian.routes.js';
import replayRoutes from './api/routes/replay.routes.js';
import simulationRoutes from './api/routes/simulation.routes.js';
import analyticsRoutes from './api/routes/analytics.routes.js';
import contractRoutes from './api/routes/contract.routes.js';
import healthRoutes from './api/routes/health.routes.js';
import { errorHandler } from './api/middleware/error.middleware.js';

dotenv.config();

const app = express();
export const httpServer = createServer(app);
export const io = new Server(httpServer, {
  cors: { origin: '*' }
});

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Routes
app.use('/auth', authRoutes);
app.use('/sui', suiRoutes);
app.use('/market', marketRoutes);
app.use('/ai', aiRoutes);
app.use('/protection', protectionRoutes);
app.use('/risk', riskRoutes);
app.use('/whales', whaleRoutes);
app.use('/portfolio', portfolioRoutes);
app.use('/guardian', guardianRoutes);
app.use('/replay', replayRoutes);
app.use('/simulation', simulationRoutes);
app.use('/analytics', analyticsRoutes);
app.use('/contract', contractRoutes);
app.use('/health', healthRoutes);

// Socket.io
io.on('connection', (socket) => {
  console.log(`Socket connected: ${socket.id}`);
  socket.on('disconnect', () => {
    console.log(`Socket disconnected: ${socket.id}`);
  });
});

// Error handling
app.use(errorHandler);

export default app;
