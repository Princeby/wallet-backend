import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config/env';
import { AuthRequest } from '../types/express';
import  BlacklistedToken  from '../models/blacklistedToken';

interface JwtPayload {
  userId: number;
  email: string;
}

export const authMiddleware = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    // Get token from authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({ message: 'Authentication required' });
      return;
    }
    
    const token = authHeader.split(' ')[1];
    
    // Check if token is blacklisted
    const isBlacklisted = await BlacklistedToken.isTokenBlacklisted(token);
    if (isBlacklisted) {
      res.status(401).json({ message: 'Token has been invalidated' });
      return;
    }
    
    // Verify token
    const decoded = jwt.verify(token, config.jwtSecret) as JwtPayload;
        
    // Attach user info to request
    req.user = decoded;
    
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    
    // Handle specific JWT errors
    if (error instanceof jwt.TokenExpiredError) {
      res.status(401).json({ message: 'Token has expired' });
      return;
    } else if (error instanceof jwt.JsonWebTokenError) {
      res.status(401).json({ message: 'Invalid token' });
      return;
    }
    
    res.status(401).json({ message: 'Authentication failed' });
  }
};