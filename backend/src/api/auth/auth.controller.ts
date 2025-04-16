import { Request, Response, NextFunction } from 'express';
import { User } from '../../models';
import { ApiError } from '../../middleware/errorHandler';

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

    // Return token
    res.status(201).json({
      success: true,
      token,
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

    // Return token
    res.status(200).json({
      success: true,
      token,
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
      attributes: ['id', 'name', 'email', 'role', 'createdAt'],
    });

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
}; 