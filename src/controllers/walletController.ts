import { Request, Response } from 'express';
import { Wallet } from '../models';
import { AuthRequest } from '../types/express';

// Helper function to standardize error handling
const handleError = (error: unknown, res: Response, customMessage?: string): void => {
  console.error(customMessage || 'Error in wallet operation:', error);
  
  // Handle Sequelize validation errors
  if (error instanceof Error) {
    // Check for Sequelize validation errors
    if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
      const validationError = error as any;
      const messages = validationError.errors?.map((e: any) => e.message) || ['Validation error'];
      res.status(400).json({ 
        message: 'Validation error',
        errors: messages
      });
      return;
    }
    
    // Handle database connection errors
    if (error.name === 'SequelizeConnectionError' || error.name === 'SequelizeConnectionRefusedError') {
      res.status(503).json({ message: 'Database service unavailable' });
      return;
    }
    
    // Handle foreign key constraint errors
    if (error.name === 'SequelizeForeignKeyConstraintError') {
      res.status(400).json({ message: 'Invalid relationship reference' });
      return;
    }
    
    // If it's a known error with message
    if (error.message) {
      // Don't expose internal error details to client
      res.status(500).json({ message: 'Internal server error' });
      return;
    }
  }
  
  // Default server error
  res.status(500).json({ message: customMessage || 'Internal server error' });
};

// Get all wallets for the authenticated user
export const getAllWallets = async (req: AuthRequest, res: Response): Promise<void> => {
  if (!req.user || !req.user.userId) {
    res.status(401).json({ message: 'Authentication required' });
    return;
  }

  try {
    const userId = req.user.userId;

    const wallets = await Wallet.findAll({
      where: { userId }
    });

    res.status(200).json(wallets);
  } catch (error) {
    handleError(error, res, 'Error fetching wallets');
  }
};

// Create a new wallet
export const createWallet = async (req: AuthRequest, res: Response): Promise<void> => {
  if (!req.user || !req.user.userId) {
    res.status(401).json({ message: 'Authentication required' });
    return;
  }

  try {
    const userId = req.user.userId;
    const { tag, chain, address } = req.body;

    // Validate required inputs
    if (!chain) {
      res.status(400).json({ message: 'Chain is required' });
      return;
    }
    
    if (!address) {
      res.status(400).json({ message: 'Address is required' });
      return;
    }
    
    // Validate address format 
    const addressRegex = /^0x[a-fA-F0-9]{40}$/;
    if (!addressRegex.test(address)) {
      res.status(400).json({ message: 'Invalid wallet address format' });
      return;
    }

    // Check if wallet with address already exists
    const existingWallet = await Wallet.findOne({ where: { address } });
    if (existingWallet) {
      res.status(409).json({ message: 'Wallet with this address already exists' });
      return;
    }

    // Create wallet
    const wallet = await Wallet.create({
      userId,
      tag: tag || null,
      chain, 
      address
    });
    
    if (!wallet) {
      res.status(500).json({ message: 'Failed to create wallet' });
      return;
    }
    
    res.status(201).json(wallet);
  } catch (error) {
    handleError(error, res, 'Error creating wallet');
  }
};

// Get wallet by id
export const getWalletById = async (req: AuthRequest, res: Response): Promise<void> => {
  if (!req.user || !req.user.userId) {
    res.status(401).json({ message: 'Authentication required' });
    return;
  }

  try {
    const userId = req.user.userId;
    const walletIdParam = req.params.id;
    
    if (!walletIdParam) {
      res.status(400).json({ message: 'Wallet ID is required' });
      return;
    }
    
    const walletId = parseInt(walletIdParam);
    
    if (isNaN(walletId)) {
      res.status(400).json({ message: 'Invalid wallet ID format' });
      return;
    }

    const wallet = await Wallet.findOne({
      where: { id: walletId, userId }
    });

    if (!wallet) {
      res.status(404).json({ message: 'Wallet not found' });
      return;
    }

    res.status(200).json(wallet);
  } catch (error) {
    handleError(error, res, 'Error fetching wallet');
  }
};

// Update wallet
export const updateWallet = async (req: AuthRequest, res: Response): Promise<void> => {
  if (!req.user || !req.user.userId) {
    res.status(401).json({ message: 'Authentication required' });
    return;
  }

  try {
    const userId = req.user.userId;
    const walletIdParam = req.params.id;
    
    if (!walletIdParam) {
      res.status(400).json({ message: 'Wallet ID is required' });
      return;
    }
    
    const walletId = parseInt(walletIdParam);
    
    if (isNaN(walletId)) {
      res.status(400).json({ message: 'Invalid wallet ID format' });
      return;
    }
    
    const { tag, chain, address } = req.body;

    // Validate inputs if provided
    if (address) {
      const addressRegex = /^0x[a-fA-F0-9]{40}$/;
      if (!addressRegex.test(address)) {
        res.status(400).json({ message: 'Invalid wallet address format' });
        return;
      }
    }

    // Find wallet
    const wallet = await Wallet.findOne({
      where: { id: walletId, userId }
    });

    if (!wallet) {
      res.status(404).json({ message: 'Wallet not found' });
      return;
    }

    // If address is changing, check if it's unique
    if (address && address !== wallet.address) {
      const existingWallet = await Wallet.findOne({ where: { address } });
      if (existingWallet) {
        res.status(409).json({ message: 'Wallet with this address already exists' });
        return;
      }
    }

    // Update wallet
    await wallet.update({
      tag: tag !== undefined ? tag : wallet.tag,
      chain: chain || wallet.chain,
      address: address || wallet.address
    });

    // Fetch updated wallet
    const updatedWallet = await Wallet.findOne({
      where: { id: walletId }
    });

    if (!updatedWallet) {
      res.status(500).json({ message: 'Error retrieving updated wallet' });
      return;
    }

    res.status(200).json(updatedWallet);
  } catch (error) {
    handleError(error, res, 'Error updating wallet');
  }
};

// Delete wallet
export const deleteWallet = async (req: AuthRequest, res: Response): Promise<void> => {
  if (!req.user || !req.user.userId) {
    res.status(401).json({ message: 'Authentication required' });
    return;
  }

  try {
    const userId = req.user.userId;
    const walletIdParam = req.params.id;
    
    if (!walletIdParam) {
      res.status(400).json({ message: 'Wallet ID is required' });
      return;
    }
    
    const walletId = parseInt(walletIdParam);
    
    if (isNaN(walletId)) {
      res.status(400).json({ message: 'Invalid wallet ID format' });
      return;
    }

    // Find wallet
    const wallet = await Wallet.findOne({
      where: { id: walletId, userId }
    });

    if (!wallet) {
      res.status(404).json({ message: 'Wallet not found' });
      return;
    }

    // Delete wallet
    const deleteResult = await wallet.destroy();
    
    // if (!deleteResult) {
    //   res.status(500).json({ message: 'Failed to delete wallet' });
    //   return;
    // }

    res.status(200).json({ message: 'Wallet deleted successfully' });
  } catch (error) {
    handleError(error, res, 'Error deleting wallet');
  }
};