import { body, param } from 'express-validator';

// Add item to cart validator
export const addToCartValidator = [
  body('productId').isUUID().withMessage('Product ID must be a valid UUID'),
  body('quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1'),
];

// Update cart item validator
export const updateCartItemValidator = [
  param('itemId').isUUID().withMessage('Item ID must be a valid UUID'),
  body('quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1'),
]; 