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
import { validate } from '../../middleware/validate';
import { protect } from '../../middleware/auth';

const router = Router();

// Protect all routes
router.use(protect);

// User profile routes
router.get('/profile', getProfile);
router.put('/profile', validate(updateProfileValidation), updateProfile);
router.put('/change-password', validate(changePasswordValidation), changePassword);

// User address routes
router.get('/addresses', getAddresses);
router.get('/addresses/:id', getAddressById);
router.post('/addresses', validate(addressValidation), createAddress);
router.put('/addresses/:id', validate(addressValidation), updateAddress);
router.delete('/addresses/:id', deleteAddress);
router.put('/addresses/:id/default', setDefaultAddress);

export default router; 