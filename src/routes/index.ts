import express from 'express';
import authRoutes from './auth';
import walletRoutes from './wallet';

const router = express.Router();

// API routes
router.use('/auth', authRoutes);
router.use('/wallets', walletRoutes);

export default router;