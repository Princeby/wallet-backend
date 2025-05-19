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
exports.authMiddleware = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const env_1 = require("../config/env");
const blacklistedToken_1 = __importDefault(require("../models/blacklistedToken"));
const authMiddleware = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Get token from authorization header
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            res.status(401).json({ message: 'Authentication required' });
            return;
        }
        const token = authHeader.split(' ')[1];
        // Check if token is blacklisted
        const isBlacklisted = yield blacklistedToken_1.default.isTokenBlacklisted(token);
        if (isBlacklisted) {
            res.status(401).json({ message: 'Token has been invalidated' });
            return;
        }
        // Verify token - don't specify the expected payload structure
        const decoded = jsonwebtoken_1.default.verify(token, env_1.config.jwtSecret);
        // Ensure decoded is an object before proceeding
        if (typeof decoded !== 'object' || decoded === null) {
            throw new Error('Invalid token payload');
        }
        // Attach user info to request - this is key!
        req.user = {
            userId: decoded.userId,
            email: decoded.email
        };
        next();
    }
    catch (error) {
        console.error('Authentication error:', error);
        // Handle specific JWT errors
        if (error instanceof jsonwebtoken_1.default.TokenExpiredError) {
            res.status(401).json({ message: 'Token has expired' });
            return;
        }
        else if (error instanceof jsonwebtoken_1.default.JsonWebTokenError) {
            res.status(401).json({ message: 'Invalid token' });
            return;
        }
        res.status(401).json({ message: 'Authentication failed' });
    }
});
exports.authMiddleware = authMiddleware;
