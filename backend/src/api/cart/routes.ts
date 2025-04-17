import { Router } from 'express';
import * as cartController from './controller';
import { authMiddleware } from '../../middleware/auth';
import { validateRequest } from '../../middleware/validate';
import { addToCartValidator, updateCartItemValidator } from './validators';

const router = Router();

// All cart routes require authentication
router.use(authMiddleware);

// Cart routes
router.get('/', cartController.getCart);
router.post('/', validateRequest(addToCartValidator), cartController.addToCart);
router.put('/:itemId', validateRequest(updateCartItemValidator), cartController.updateCartItem);
router.delete('/:itemId', cartController.removeCartItem);
router.delete('/', cartController.clearCart);

export default router; 