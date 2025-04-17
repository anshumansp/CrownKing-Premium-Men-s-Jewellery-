import { body, param } from 'express-validator';

// Add to wishlist validator
export const addToWishlistValidator = [
  body('productId').isUUID().withMessage('Product ID must be a valid UUID'),
]; 