import { Router, Request, Response } from 'express';
import { 
  register, 
  login, 
  getMe, 
  forgotPassword, 
  resetPassword, 
  logout 
} from './auth.controller';
import { 
  registerValidation, 
  loginValidation, 
  forgotPasswordValidation, 
  resetPasswordValidation 
} from './auth.validators';
import { validateRequest } from '../../middleware/validate';
import { authMiddleware } from '../../middleware/auth';
import passport from '../../config/passport';

const router = Router();

// Register a new user
router.post('/register', validateRequest(registerValidation), register);

// Login user
router.post('/login', validateRequest(loginValidation), login);

// Get current user
router.get('/me', authMiddleware, getMe);

// Forgot password
router.post('/forgot-password', validateRequest(forgotPasswordValidation), forgotPassword);

// Reset password
router.post('/reset-password', validateRequest(resetPasswordValidation), resetPassword);

// Logout user
router.post('/logout', logout);

// Google OAuth routes
// Initiate Google OAuth flow
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// Google OAuth callback
router.get(
  '/google/callback',
  passport.authenticate('google', { 
    session: false,
    failureRedirect: '/login' 
  }),
  (req: Request, res: Response) => {
    // Generate JWT token after successful OAuth
    const user = req.user as any;
    const token = user.getSignedJwtToken();
    
    // Redirect to frontend with token
    res.redirect(`${process.env.CLIENT_URL}/auth/success?token=${token}`);
  }
);

export default router; 