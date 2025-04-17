import { body, param } from 'express-validator';

// Create order validator
export const createOrderValidator = [
  body('shippingAddress').isObject().withMessage('Shipping address is required'),
  body('shippingAddress.firstName').isString().notEmpty().withMessage('First name is required'),
  body('shippingAddress.lastName').isString().notEmpty().withMessage('Last name is required'),
  body('shippingAddress.address').isString().notEmpty().withMessage('Address is required'),
  body('shippingAddress.city').isString().notEmpty().withMessage('City is required'),
  body('shippingAddress.state').isString().notEmpty().withMessage('State is required'),
  body('shippingAddress.zipCode').isString().notEmpty().withMessage('Zip code is required'),
  body('shippingAddress.country').isString().notEmpty().withMessage('Country is required'),
  body('shippingAddress.phone').isString().notEmpty().withMessage('Phone is required'),
  
  body('paymentDetails').isObject().withMessage('Payment details are required'),
  body('paymentDetails.method').isIn(['credit_card', 'paypal', 'stripe']).withMessage('Invalid payment method'),
  body('paymentDetails.cardNumber').optional().isString().withMessage('Card number must be a string'),
  body('paymentDetails.expiryDate').optional().isString().withMessage('Expiry date must be a string'),
  body('paymentDetails.nameOnCard').optional().isString().withMessage('Name on card must be a string'),
  
  body('shippingMethod').isString().notEmpty().withMessage('Shipping method is required'),
];

// Update order status validator
export const updateOrderStatusValidator = [
  param('id').isUUID().withMessage('Order ID must be a valid UUID'),
  body('status').isIn(['pending', 'processing', 'shipped', 'delivered', 'cancelled']).withMessage('Invalid status'),
]; 