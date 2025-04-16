import { Router } from 'express';
import { register, login, getMe } from './auth.controller';
import { registerValidation, loginValidation } from './auth.validators';
import { validate } from '../../middleware/validate';
import { protect } from '../../middleware/auth';

const router = Router();

// Register a new user
router.post('/register', validate(registerValidation), register);

// Login user
router.post('/login', validate(loginValidation), login);

// Get current user
router.get('/me', protect, getMe);

export default router; 