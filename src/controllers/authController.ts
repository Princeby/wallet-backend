import { Request, Response } from 'express';
import { User } from '../models';
import jwt from 'jsonwebtoken';
import { config } from '../config/env';

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

export const signout = (req: Request, res: Response): void => {
  // JWT is stateless, so we just return success
  // In a real app, you might want to invalidate the token on the client side
  // or store it in a blacklist
  res.status(200).json({ message: 'Signed out successfully' });
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