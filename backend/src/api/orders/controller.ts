import { Request, Response, NextFunction } from 'express';
import { Transaction } from 'sequelize';
import Order from '../../models/order.model';
import CartItem from '../../models/cart.model';
import Product from '../../models/product.model';
import { sequelize } from '../../models';
import { NotFoundError, BadRequestError, ForbiddenError } from '../../utils/errors';
import Stripe from 'stripe';
import config from '../../config';

const stripe = new Stripe(config.stripe.secretKey, {
  apiVersion: '2023-10-16' as Stripe.LatestApiVersion,
});

// Default pagination values
const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;

/**
 * Create a new order from cart items
 */
export const createOrder = async (req: Request, res: Response, next: NextFunction) => {
  const transaction: Transaction = await sequelize.transaction();
  
  try {
    const userId = req.user!.id;
    const { shippingAddress, paymentDetails, shippingMethod } = req.body;
    
    // Get cart items
    const cartItems = await CartItem.findAll({
      where: { userId },
      include: [
        {
          model: Product,
          as: 'product',
          attributes: ['id', 'name', 'price', 'images', 'inStock', 'discount'],
        },
      ],
      transaction,
    });
    
    if (cartItems.length === 0) {
      await transaction.rollback();
      return next(new BadRequestError('Cart is empty'));
    }
    
    // Check if all items are in stock
    const unavailableItems = cartItems.filter((item: any) => !item.product.inStock);
    
    if (unavailableItems.length > 0) {
      await transaction.rollback();
      return next(new BadRequestError('Some items in your cart are no longer available'));
    }
    
    // Calculate order total
    const subtotal = cartItems.reduce((total, item: any) => {
      const price = parseFloat(item.product.price);
      const discount = item.product.discount || 0;
      const discountedPrice = price - (price * (discount / 100));
      return total + (discountedPrice * item.quantity);
    }, 0);
    
    // Apply shipping cost based on method
    let shippingCost = 0;
    switch (shippingMethod) {
      case 'standard':
        shippingCost = 500; // ₹500
        break;
      case 'express':
        shippingCost = 1000; // ₹1000
        break;
      case 'free':
        shippingCost = 0;
        break;
      default:
        shippingCost = 500; // Default to standard
    }
    
    const total = subtotal + shippingCost;
    
    // Process payment with Stripe if credit card is used
    let paymentIntentId = null;
    
    if (paymentDetails.method === 'stripe') {
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(total * 100), // Convert to smallest currency unit (paise)
        currency: 'inr',
        metadata: {
          userId,
          integration_check: 'accept_a_payment',
        },
      });
      
      paymentIntentId = paymentIntent.id;
    }
    
    // Create order
    const order = await Order.create({
      userId,
      items: cartItems.map((item: any) => ({
        productId: item.productId,
        name: item.product.name,
        price: parseFloat(item.product.price),
        quantity: item.quantity,
        discount: item.product.discount || 0,
        images: item.product.images,
      })),
      shippingAddress,
      paymentDetails: {
        ...paymentDetails,
        // Do not save sensitive information
        cardNumber: paymentDetails.cardNumber ? `xxxx-xxxx-xxxx-${paymentDetails.cardNumber.slice(-4)}` : null,
        cvv: '***',
      },
      shippingMethod,
      shippingCost,
      subtotal,
      total,
      status: 'pending',
      paymentIntentId: paymentIntentId || undefined,
    }, { transaction });
    
    // Clear cart after order creation
    await CartItem.destroy({
      where: { userId },
      transaction,
    });
    
    await transaction.commit();
    
    res.status(201).json({
      success: true,
      data: order,
      clientSecret: paymentIntentId ? await stripe.paymentIntents.retrieve(paymentIntentId).then((pi: Stripe.PaymentIntent) => pi.client_secret) : null,
    });
  } catch (error) {
    await transaction.rollback();
    next(error);
  }
};

/**
 * Get all orders for a user
 */
export const getUserOrders = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;
    const page = parseInt(req.query.page as string) || DEFAULT_PAGE;
    const limit = parseInt(req.query.limit as string) || DEFAULT_LIMIT;
    const offset = (page - 1) * limit;
    
    const orders = await Order.findAndCountAll({
      where: { userId },
      limit,
      offset,
      order: [['createdAt', 'DESC']],
    });
    
    res.json({
      success: true,
      data: {
        orders: orders.rows,
        totalOrders: orders.count,
        totalPages: Math.ceil(orders.count / limit),
        currentPage: page,
        limit,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get order by ID
 */
export const getOrderById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;
    const orderId = req.params.id;
    
    const order = await Order.findByPk(orderId);
    
    if (!order) {
      return next(new NotFoundError('Order not found'));
    }
    
    // Ensure user can only access their own orders
    if (order.userId !== userId && req.user!.role !== 'admin') {
      return next(new ForbiddenError('You are not authorized to view this order'));
    }
    
    res.json({
      success: true,
      data: order,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update order status
 */
export const updateOrderStatus = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;
    const orderId = req.params.id;
    const { status } = req.body;
    
    const order = await Order.findByPk(orderId);
    
    if (!order) {
      return next(new NotFoundError('Order not found'));
    }
    
    // Only admins can update status
    if (req.user!.role !== 'admin') {
      return next(new ForbiddenError('You are not authorized to update order status'));
    }
    
    // Update status
    await order.update({ status });
    
    res.json({
      success: true,
      message: 'Order status updated',
      data: order,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Cancel an order
 */
export const cancelOrder = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;
    const orderId = req.params.id;
    
    const order = await Order.findByPk(orderId);
    
    if (!order) {
      return next(new NotFoundError('Order not found'));
    }
    
    // Ensure user can only cancel their own orders
    if (order.userId !== userId && req.user!.role !== 'admin') {
      return next(new ForbiddenError('You are not authorized to cancel this order'));
    }
    
    // Can only cancel if status is pending or processing
    if (order.status !== 'pending' && order.status !== 'processing') {
      return next(new BadRequestError('Order cannot be cancelled at this stage'));
    }
    
    // Refund payment if using Stripe
    if (order.paymentIntentId) {
      try {
        await stripe.refunds.create({
          payment_intent: order.paymentIntentId,
        });
      } catch (error) {
        console.error('Stripe refund error:', error);
        // Continue with cancellation even if refund fails
      }
    }
    
    // Update status to cancelled
    await order.update({ status: 'cancelled' });
    
    res.json({
      success: true,
      message: 'Order cancelled successfully',
      data: order,
    });
  } catch (error) {
    next(error);
  }
}; 