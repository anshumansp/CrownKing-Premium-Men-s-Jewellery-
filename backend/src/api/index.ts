import { Router, Request, Response } from 'express';
import authRoutes from './auth/auth.routes';

// Initialize the main router
const router = Router();

// Health check route
router.get('/health', (_req: Request, res: Response) => {
  res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Mount routes
router.use('/auth', authRoutes);

export default router; 