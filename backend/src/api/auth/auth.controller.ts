import { Request, Response, NextFunction } from 'express';
import { User } from '../../models';
import { ApiError } from '../../middleware/errorHandler';
import crypto from 'crypto';
import { sendPasswordResetEmail } from '../../services/email.service';
import { Op } from 'sequelize';

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return next(new ApiError('User already exists', 400));
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password,
      role: 'user', // Set default role
    });

    // Generate JWT token
    const token = user.getSignedJwtToken();

    // Return token and user info
    res.status(201).json({
      success: true,
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body;

    // Check if email and password are provided
    if (!email || !password) {
      return next(new ApiError('Please provide email and password', 400));
    }

    // Find user
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return next(new ApiError('Invalid credentials', 401));
    }

    // Check if password matches
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return next(new ApiError('Invalid credentials', 401));
    }

    // Generate JWT token
    const token = user.getSignedJwtToken();

    // Return token and user info
    res.status(200).json({
      success: true,
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) {
      return next(new ApiError('Not authorized', 401));
    }

    const user = await User.findByPk(req.user.id, {
      attributes: ['id', 'name', 'email', 'role', 'createdAt', 'phone'],
    });

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Forgot password
// @route   POST /api/auth/forgot-password
// @access  Public
export const forgotPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email } = req.body;

    // Find user by email
    const user = await User.findOne({ where: { email } });
    if (!user) {
      // Don't reveal if user exists for security reasons
      return res.status(200).json({
        success: true,
        message: 'If your email is registered, you will receive a password reset link',
      });
    }

    // Generate reset token (32 bytes = 64 hex characters)
    const resetToken = crypto.randomBytes(32).toString('hex');

    // Hash token and set to resetPasswordToken field
    const resetPasswordToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');

    // Set expiration (10 minutes)
    const resetPasswordExpire = new Date(Date.now() + 10 * 60 * 1000);

    // Update user with reset token and expiration
    await user.update({
      resetPasswordToken,
      resetPasswordExpire,
    });

    // Send email with reset token
    try {
      await sendPasswordResetEmail(email, resetToken);

      res.status(200).json({
        success: true,
        message: 'Password reset email sent',
      });
    } catch (error) {
      // If email fails, clear reset token
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;
      await user.save();

      return next(new ApiError('Email could not be sent', 500));
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Reset password
// @route   POST /api/auth/reset-password
// @access  Public
export const resetPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { token, password } = req.body;

    // Hash token from URL
    const resetPasswordToken = crypto
      .createHash('sha256')
      .update(token)
      .digest('hex');

    // Find user by reset token and check if expired
    const user = await User.findOne({
      where: {
        resetPasswordToken,
        resetPasswordExpire: { [Op.gt]: new Date() },
      },
    });

    if (!user) {
      return next(new ApiError('Invalid or expired token', 400));
    }

    // Set new password and clear reset fields
    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    // Return success message
    res.status(200).json({
      success: true,
      message: 'Password reset successful',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Logout user / clear cookie (if using cookies)
// @route   POST /api/auth/logout
// @access  Private
export const logout = async (
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  // If using sessions, destroy session
  if (req.session) {
    req.session.destroy((err: Error | null) => {
      if (err) {
        return res.status(500).json({
          success: false,
          error: {
            message: 'Failed to logout',
            code: 'LOGOUT_FAILED'
          }
        });
      }
      
      res.status(200).json({
        success: true,
        message: 'Logged out successfully',
      });
    });
  } else {
    // If just using JWT with no server-side session, just return success
    // Frontend will need to remove the token from storage
    res.status(200).json({
      success: true,
      message: 'Logged out successfully',
    });
  }
}; 