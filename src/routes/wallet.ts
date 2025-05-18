import express from 'express';
import { 
  getAllWallets, 
  createWallet, 
  getWalletById, 
  updateWallet, 
  deleteWallet 
} from '../controllers/walletController';
import { authMiddleware } from '../middleware/auth';
import { validateWalletInput } from '../middleware/validation';

const router = express.Router();

// Apply auth middleware to all wallet routes
router.use(authMiddleware);

// Wallet routes
router.get('/', getAllWallets);
router.post('/', validateWalletInput, createWallet);
router.get('/:id', getWalletById);
router.put('/:id', validateWalletInput, updateWallet);
router.delete('/:id', deleteWallet);

export default router;