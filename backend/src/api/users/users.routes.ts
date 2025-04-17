import { Router } from 'express';
import {
  getProfile,
  updateProfile,
  changePassword,
  getAddresses,
  getAddressById,
  createAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
} from './users.controller';
import {
  updateProfileValidation,
  changePasswordValidation,
  addressValidation,
} from './users.validators';
import { validateRequest } from '../../middleware/validate';
import { authMiddleware } from '../../middleware/auth';

const router = Router();

// Protect all routes
router.use(authMiddleware);

// User profile routes
router.get('/profile', getProfile);
router.put('/profile', validateRequest(updateProfileValidation), updateProfile);
router.put('/change-password', validateRequest(changePasswordValidation), changePassword);

// User address routes
router.get('/addresses', getAddresses);
router.get('/addresses/:id', getAddressById);
router.post('/addresses', validateRequest(addressValidation), createAddress);
router.put('/addresses/:id', validateRequest(addressValidation), updateAddress);
router.delete('/addresses/:id', deleteAddress);
router.put('/addresses/:id/default', setDefaultAddress);

export default router; 