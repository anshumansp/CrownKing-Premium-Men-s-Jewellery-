import { body } from 'express-validator';

// Validation rules for updating user profile
export const updateProfileValidation = [
  body('name').optional().notEmpty().withMessage('Name cannot be empty'),
  body('email').optional().isEmail().withMessage('Please include a valid email'),
  body('phone').optional().notEmpty().withMessage('Phone cannot be empty'),
];

// Validation rules for changing password
export const changePasswordValidation = [
  body('currentPassword').notEmpty().withMessage('Current password is required'),
  body('newPassword')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters'),
];

// Validation rules for address creation/update
export const addressValidation = [
  body('type')
    .notEmpty()
    .withMessage('Address type is required')
    .isIn(['billing', 'shipping'])
    .withMessage('Address type must be billing or shipping'),
  body('firstName').notEmpty().withMessage('First name is required'),
  body('lastName').notEmpty().withMessage('Last name is required'),
  body('address').notEmpty().withMessage('Address is required'),
  body('city').notEmpty().withMessage('City is required'),
  body('state').notEmpty().withMessage('State is required'),
  body('zipCode').notEmpty().withMessage('Zip code is required'),
  body('country').notEmpty().withMessage('Country is required'),
  body('phone').optional().notEmpty().withMessage('Phone cannot be empty'),
  body('isDefault').optional().isBoolean().withMessage('Is default must be a boolean'),
]; 