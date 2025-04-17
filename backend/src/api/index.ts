import { Router, Request, Response } from 'express';
import authRoutes from './auth/auth.routes';
import userRoutes from './users/users.routes';
import productsRoutes from './products';
import cartRoutes from './cart';
import ordersRoutes from './orders';
import wishlistRoutes from './wishlist';

// Initialize the main router
const router = Router();

// Health check route
router.get('/health', (_req: Request, res: Response) => {
  res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Mount routes
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/products', productsRoutes);
router.use('/cart', cartRoutes);
router.use('/orders', ordersRoutes);
router.use('/wishlist', wishlistRoutes);

export default router; 