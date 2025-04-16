import { Request, Response, NextFunction } from 'express';
import { User, Address } from '../../models';
import { ApiError } from '../../middleware/errorHandler';
import bcrypt from 'bcryptjs';

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
export const getProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) {
      return next(new ApiError('Not authorized', 401));
    }

    const user = await User.findByPk(req.user.id, {
      attributes: ['id', 'name', 'email', 'role', 'phone', 'createdAt'],
    });

    if (!user) {
      return next(new ApiError('User not found', 404));
    }

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
export const updateProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) {
      return next(new ApiError('Not authorized', 401));
    }

    const { name, email, phone } = req.body;

    // Check if email is already taken (if trying to change it)
    if (email && email !== req.user.email) {
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        return next(new ApiError('Email already in use', 400));
      }
    }

    // Find user
    const user = await User.findByPk(req.user.id);
    if (!user) {
      return next(new ApiError('User not found', 404));
    }

    // Update user fields if provided
    if (name) user.name = name;
    if (email) user.email = email;
    if (phone !== undefined) user.phone = phone;

    await user.save();

    res.status(200).json({
      success: true,
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Change user password
// @route   PUT /api/users/change-password
// @access  Private
export const changePassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) {
      return next(new ApiError('Not authorized', 401));
    }

    const { currentPassword, newPassword } = req.body;

    // Find user
    const user = await User.findByPk(req.user.id);
    if (!user) {
      return next(new ApiError('User not found', 404));
    }

    // Check if current password matches
    const isMatch = await user.matchPassword(currentPassword);
    if (!isMatch) {
      return next(new ApiError('Current password is incorrect', 401));
    }

    // Update password
    user.password = newPassword;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Password updated successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user addresses
// @route   GET /api/users/addresses
// @access  Private
export const getAddresses = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) {
      return next(new ApiError('Not authorized', 401));
    }

    const addresses = await Address.findAll({
      where: { userId: req.user.id },
    });

    res.status(200).json({
      success: true,
      data: addresses,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user address by ID
// @route   GET /api/users/addresses/:id
// @access  Private
export const getAddressById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) {
      return next(new ApiError('Not authorized', 401));
    }

    const address = await Address.findOne({
      where: {
        id: req.params.id,
        userId: req.user.id,
      },
    });

    if (!address) {
      return next(new ApiError('Address not found', 404));
    }

    res.status(200).json({
      success: true,
      data: address,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create user address
// @route   POST /api/users/addresses
// @access  Private
export const createAddress = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) {
      return next(new ApiError('Not authorized', 401));
    }

    const { 
      type, 
      firstName, 
      lastName, 
      address, 
      city, 
      state, 
      zipCode, 
      country, 
      phone, 
      isDefault 
    } = req.body;

    // If setting as default, unset any existing default for this type
    if (isDefault) {
      await Address.update(
        { isDefault: false },
        { 
          where: { 
            userId: req.user.id,
            type,
            isDefault: true
          } 
        }
      );
    }

    // Create new address
    const newAddress = await Address.create({
      userId: req.user.id,
      type,
      firstName,
      lastName,
      address,
      city,
      state,
      zipCode,
      country,
      phone,
      isDefault: isDefault || false,
    });

    res.status(201).json({
      success: true,
      data: newAddress,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user address
// @route   PUT /api/users/addresses/:id
// @access  Private
export const updateAddress = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) {
      return next(new ApiError('Not authorized', 401));
    }

    // Find address
    const address = await Address.findOne({
      where: {
        id: req.params.id,
        userId: req.user.id,
      },
    });

    if (!address) {
      return next(new ApiError('Address not found', 404));
    }

    const { 
      type, 
      firstName, 
      lastName, 
      address: addressLine, 
      city, 
      state, 
      zipCode, 
      country, 
      phone, 
      isDefault 
    } = req.body;

    // If setting as default and type is changing, unset any existing default for new type
    if (isDefault && type && type !== address.type) {
      await Address.update(
        { isDefault: false },
        { 
          where: { 
            userId: req.user.id,
            type,
            isDefault: true
          } 
        }
      );
    } 
    // If just setting as default for current type
    else if (isDefault && !address.isDefault) {
      await Address.update(
        { isDefault: false },
        { 
          where: { 
            userId: req.user.id,
            type: address.type,
            isDefault: true
          } 
        }
      );
    }

    // Update address fields
    if (type) address.type = type;
    if (firstName) address.firstName = firstName;
    if (lastName) address.lastName = lastName;
    if (addressLine) address.address = addressLine;
    if (city) address.city = city;
    if (state) address.state = state;
    if (zipCode) address.zipCode = zipCode;
    if (country) address.country = country;
    if (phone !== undefined) address.phone = phone;
    if (isDefault !== undefined) address.isDefault = isDefault;

    await address.save();

    res.status(200).json({
      success: true,
      data: address,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete user address
// @route   DELETE /api/users/addresses/:id
// @access  Private
export const deleteAddress = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) {
      return next(new ApiError('Not authorized', 401));
    }

    // Find address
    const address = await Address.findOne({
      where: {
        id: req.params.id,
        userId: req.user.id,
      },
    });

    if (!address) {
      return next(new ApiError('Address not found', 404));
    }

    // Delete address
    await address.destroy();

    res.status(200).json({
      success: true,
      message: 'Address deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Set address as default
// @route   PUT /api/users/addresses/:id/default
// @access  Private
export const setDefaultAddress = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) {
      return next(new ApiError('Not authorized', 401));
    }

    const { type } = req.body;
    if (!type || !['shipping', 'billing'].includes(type)) {
      return next(new ApiError('Valid address type is required', 400));
    }

    // Find the address
    const address = await Address.findOne({
      where: {
        id: req.params.id,
        userId: req.user.id,
      },
    });

    if (!address) {
      return next(new ApiError('Address not found', 404));
    }

    // If type is different, update the address type
    if (address.type !== type) {
      address.type = type;
    }

    // Unset any existing default for this type
    await Address.update(
      { isDefault: false },
      { 
        where: { 
          userId: req.user.id,
          type,
          isDefault: true
        } 
      }
    );

    // Set this address as default
    address.isDefault = true;
    await address.save();

    res.status(200).json({
      success: true,
      data: address,
    });
  } catch (error) {
    next(error);
  }
}; 