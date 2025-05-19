import { Request, Response } from 'express';
import { User, BlacklistedToken } from '../models';
import jwt from 'jsonwebtoken';
import { config } from '../config/env';
import { AuthRequest } from '../types/express';

export const signin = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      res.status(400).json({ message: 'Email and password are required' });
      return;
    }

    // Find user
    const user = await User.findOne({ where: { email } });
    if (!user) {
      res.status(401).json({ message: 'Invalid credentials' });
      return;
    }

    // Verify password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      res.status(401).json({ message: 'Invalid credentials' });
      return;
    }

    // Generate JWT token
    const token = jwt.sign(
        { userId: user.id, email: user.email },
        config.jwtSecret.toString(),
        { expiresIn: config.jwtExpiresIn }
      );

    // Send response
    res.status(200).json({
      message: 'Authentication successful',
      token,
      user: {
        id: user.id,
        email: user.email
      }
    });
  } catch (error) {
    console.error('Authentication error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};


  /**
   * Sign out a user by blacklisting their JWT token
   * @route POST /signout
   * @param req - Express request object with user and token from auth middleware
   * @param res - Express response object
   */
  export const signout = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      // Get the token from the authorization header
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        res.status(401).json({ message: 'Authentication required' });
        return;
      }
  
      const token = authHeader.split(' ')[1];
      
      // Verify and decode the token to get the user ID and expiration time
      const decoded = jwt.verify(token, config.jwtSecret) as jwt.JwtPayload;
      
      // Get userId either from req.user (set by middleware) or directly from decoded token
      const userId = req.user?.userId || decoded.userId;
      
      if (!userId) {
        res.status(401).json({ message: 'Invalid authentication' });
        return;
      }
      
      // Calculate expiration date from token
      const expiresAt = new Date(decoded.exp! * 1000); // Convert from seconds to milliseconds
  
      // Check if token is already blacklisted
      const isBlacklisted = await BlacklistedToken.isTokenBlacklisted(token);
      if (isBlacklisted) {
        res.status(400).json({ message: 'Token already invalidated' });
        return;
      }
  
      // Add token to blacklist
      await BlacklistedToken.create({
        token,
        userId,
        expiresAt
      });
  
      res.status(200).json({ message: 'Signed out successfully' });
    } catch (error) {
      console.error('Sign out error:', error);
      
      // Handle jwt verification errors specifically
      if (error instanceof jwt.JsonWebTokenError) {
        res.status(401).json({ message: 'Invalid token' });
        return;
      }
      
      res.status(500).json({ message: 'Internal server error' });
    }
  };
  


export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      res.status(400).json({ message: 'Email and password are required' });
      return;
    }

    // Check if user already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      res.status(409).json({ message: 'User already exists with this email' });
      return;
    }

    // Create new user
    const user = await User.create({ email, password });

    // Generate JWT token
    const token = jwt.sign(
        { userId: user.id, email: user.email },
        config.jwtSecret.toString(),
        { expiresIn: config.jwtExpiresIn }
        );

    // Send response
    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: user.id,
        email: user.email
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};