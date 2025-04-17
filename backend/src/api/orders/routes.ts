import { Router } from 'express';
import * as ordersController from './controller';
import { authMiddleware } from '../../middleware/auth';
import { validateRequest } from '../../middleware/validate';
import { createOrderValidator, updateOrderStatusValidator } from './validators';

const router = Router();

// All order routes require authentication
router.use(authMiddleware);

// Order routes
router.post('/', validateRequest(createOrderValidator), ordersController.createOrder);
router.get('/', ordersController.getUserOrders);
router.get('/:id', ordersController.getOrderById);
router.put('/:id/status', validateRequest(updateOrderStatusValidator), ordersController.updateOrderStatus);
router.post('/:id/cancel', ordersController.cancelOrder);

export default router; 