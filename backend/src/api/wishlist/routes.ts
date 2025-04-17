import { Router } from 'express';
import * as wishlistController from './controller';
import { authMiddleware } from '../../middleware/auth';
import { validateRequest } from '../../middleware/validate';
import { addToWishlistValidator } from './validators';

const router = Router();

// All wishlist routes require authentication
router.use(authMiddleware);

// Wishlist routes
router.get('/', wishlistController.getWishlist);
router.post('/', validateRequest(addToWishlistValidator), wishlistController.addToWishlist);
router.delete('/:productId', wishlistController.removeFromWishlist);
router.delete('/', wishlistController.clearWishlist);

export default router; 