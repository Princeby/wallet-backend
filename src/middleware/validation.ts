import { Request, Response, NextFunction } from 'express';

export const validateEmail = (req: Request, res: Response, next: NextFunction): void => {
  const { email } = req.body;
  
  // Simple email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email)) {
    res.status(400).json({ message: 'Valid email is required' });
    return;
  }
  
  next();
};

export const validatePassword = (req: Request, res: Response, next: NextFunction): void => {
  const { password } = req.body;
  
  // Password must be at least 6 characters
  if (!password || password.length < 6) {
    res.status(400).json({ message: 'Password must be at least 6 characters' });
    return;
  }
  
  next();
};

export const validateWalletInput = (req: Request, res: Response, next: NextFunction): void => {
  const { chain, address } = req.body;
  
  if (!chain) {
    res.status(400).json({ message: 'Chain is required' });
    return;
  }
  
  if (!address) {
    res.status(400).json({ message: 'Address is required' });
    return;
  }
  
  // Basic address validation (should be enhanced based on specific chain requirements)
  if (address.length < 10) {
    res.status(400).json({ message: 'Invalid wallet address' });
    return;
  }
  
  next();
};
