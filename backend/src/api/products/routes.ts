import { Router } from 'express';
import * as productController from './controller';
import { authMiddleware, optionalAuthMiddleware } from '../../middleware/auth';
import { validateRequest } from '../../middleware/validate';
import { searchProductsValidator, getProductReviewsValidator, createProductReviewValidator } from './validators';

const router = Router();

// Public routes (no auth required)
router.get('/', optionalAuthMiddleware, productController.getProducts);
router.get('/search', optionalAuthMiddleware, validateRequest(searchProductsValidator), productController.searchProducts);
router.get('/featured', optionalAuthMiddleware, productController.getFeaturedProducts);
router.get('/categories', productController.getProductCategories);
router.get('/:id', optionalAuthMiddleware, productController.getProductById);

// Reviews - public for reading, auth for creating
router.get('/:productId/reviews', validateRequest(getProductReviewsValidator), productController.getProductReviews);
router.post('/:productId/reviews', authMiddleware, validateRequest(createProductReviewValidator), productController.createProductReview);

export default router; 