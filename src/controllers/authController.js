"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.register = exports.signout = exports.signin = void 0;
const models_1 = require("../models");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const env_1 = require("../config/env");
const signin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        // Validate input
        if (!email || !password) {
            res.status(400).json({ message: 'Email and password are required' });
            return;
        }
        // Find user
        const user = yield models_1.User.findOne({ where: { email } });
        if (!user) {
            res.status(401).json({ message: 'Invalid credentials' });
            return;
        }
        // Verify password
        const isPasswordValid = yield user.comparePassword(password);
        if (!isPasswordValid) {
            res.status(401).json({ message: 'Invalid credentials' });
            return;
        }
        // Generate JWT token
        const token = jsonwebtoken_1.default.sign({ userId: user.id, email: user.email }, env_1.config.jwtSecret, { expiresIn: env_1.config.jwtExpiresIn });
        // Send response
        res.status(200).json({
            message: 'Authentication successful',
            token,
            user: {
                id: user.id,
                email: user.email
            }
        });
    }
    catch (error) {
        console.error('Authentication error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});
exports.signin = signin;
/**
 * Sign out a user by blacklisting their JWT token
 * @route POST /signout
 * @param req - Express request object with user and token from auth middleware
 * @param res - Express response object
 */
const signout = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        // Get the token from the authorization header
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            res.status(401).json({ message: 'Authentication required' });
            return;
        }
        const token = authHeader.split(' ')[1];
        // Verify and decode the token to get the user ID and expiration time
        const decoded = jsonwebtoken_1.default.verify(token, env_1.config.jwtSecret);
        // Get userId either from req.user (set by middleware) or directly from decoded token
        const userId = ((_a = req.user) === null || _a === void 0 ? void 0 : _a.userId) || decoded.userId;
        if (!userId) {
            res.status(401).json({ message: 'Invalid authentication' });
            return;
        }
        // Calculate expiration date from token
        const expiresAt = new Date(decoded.exp * 1000); // Convert from seconds to milliseconds
        // Check if token is already blacklisted
        const isBlacklisted = yield models_1.BlacklistedToken.isTokenBlacklisted(token);
        if (isBlacklisted) {
            res.status(400).json({ message: 'Token already invalidated' });
            return;
        }
        // Add token to blacklist
        yield models_1.BlacklistedToken.create({
            token,
            userId,
            expiresAt
        });
        res.status(200).json({ message: 'Signed out successfully' });
    }
    catch (error) {
        console.error('Sign out error:', error);
        // Handle jwt verification errors specifically
        if (error instanceof jsonwebtoken_1.default.JsonWebTokenError) {
            res.status(401).json({ message: 'Invalid token' });
            return;
        }
        res.status(500).json({ message: 'Internal server error' });
    }
});
exports.signout = signout;
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        // Validate input
        if (!email || !password) {
            res.status(400).json({ message: 'Email and password are required' });
            return;
        }
        // Check if user already exists
        const existingUser = yield models_1.User.findOne({ where: { email } });
        if (existingUser) {
            res.status(409).json({ message: 'User already exists with this email' });
            return;
        }
        // Create new user
        const user = yield models_1.User.create({ email, password });
        // Generate JWT token
        const token = jsonwebtoken_1.default.sign({ userId: user.id, email: user.email }, env_1.config.jwtSecret, // ensure it's a string
        { expiresIn: env_1.config.jwtExpiresIn });
        // Send response
        res.status(201).json({
            message: 'User registered successfully',
            token,
            user: {
                id: user.id,
                email: user.email
            }
        });
    }
    catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});
exports.register = register;
