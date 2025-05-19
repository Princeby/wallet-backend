"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateWalletInput = exports.validatePassword = exports.validateEmail = void 0;
const validateEmail = (req, res, next) => {
    const { email } = req.body;
    // Simple email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
        res.status(400).json({ message: 'Valid email is required' });
        return;
    }
    next();
};
exports.validateEmail = validateEmail;
const validatePassword = (req, res, next) => {
    const { password } = req.body;
    // Password must be at least 6 characters
    if (!password || password.length < 6) {
        res.status(400).json({ message: 'Password must be at least 6 characters' });
        return;
    }
    next();
};
exports.validatePassword = validatePassword;
const validateWalletInput = (req, res, next) => {
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
exports.validateWalletInput = validateWalletInput;
