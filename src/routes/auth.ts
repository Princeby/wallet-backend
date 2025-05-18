import express from 'express';
import { signin, signout, register } from '../controllers/authController';
import { validateEmail, validatePassword } from '../middleware/validation';

const router = express.Router();

// Authentication routes
router.post('/signin', validateEmail, validatePassword, signin);
router.post('/signout', signout);
router.post('/register', validateEmail, validatePassword, register);

export default router;