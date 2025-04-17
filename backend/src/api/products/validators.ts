import { body, query, param } from 'express-validator';

// Search products validator
export const searchProductsValidator = [
  query('query').optional().isString().withMessage('Search query must be a string'),
  query('category').optional().isString().withMessage('Category must be a string'),
  query('subCategory').optional().isString().withMessage('Sub-category must be a string'),
  query('minPrice').optional().isFloat({ min: 0 }).withMessage('Minimum price must be a positive number'),
  query('maxPrice').optional().isFloat({ min: 0 }).withMessage('Maximum price must be a positive number'),
  query('minRating').optional().isFloat({ min: 0, max: 5 }).withMessage('Minimum rating must be between 0 and 5'),
  query('sortBy').optional().isIn(['price_asc', 'price_desc', 'newest', 'rating']).withMessage('Invalid sort option'),
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 50 }).withMessage('Limit must be between 1 and 50'),
];

// Get product reviews validator
export const getProductReviewsValidator = [
  param('productId').isUUID().withMessage('Product ID must be a valid UUID'),
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 50 }).withMessage('Limit must be between 1 and 50'),
];

// Create product review validator
export const createProductReviewValidator = [
  param('productId').isUUID().withMessage('Product ID must be a valid UUID'),
  body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
  body('title').isString().isLength({ min: 3, max: 100 }).withMessage('Title must be between 3 and 100 characters'),
  body('content').isString().isLength({ min: 10, max: 1000 }).withMessage('Content must be between 10 and 1000 characters'),
]; 