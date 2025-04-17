import { Request, Response, NextFunction } from 'express';
import { Transaction } from 'sequelize';
import CartItem from '../../models/cart.model';
import Product from '../../models/product.model';
import { sequelize } from '../../models';
import { NotFoundError, BadRequestError } from '../../utils/errors';

/**
 * Get user's cart items
 */
export const getCart = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;
    
    // Get cart items with product details
    const cartItems = await CartItem.findAll({
      where: { userId },
      include: [
        {
          model: Product,
          as: 'product',
          attributes: ['id', 'name', 'price', 'images', 'category', 'subCategory', 'specifications', 'inStock', 'discount'],
        },
      ],
    });
    
    // Calculate total
    const cartTotal = cartItems.reduce((total, item: any) => {
      const price = item.product.price;
      const discount = item.product.discount || 0;
      const discountedPrice = price - (price * (discount / 100));
      return total + (discountedPrice * item.quantity);
    }, 0);
    
    res.json({
      success: true,
      data: {
        items: cartItems,
        totalItems: cartItems.length,
        cartTotal,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Add item to cart
 */
export const addToCart = async (req: Request, res: Response, next: NextFunction) => {
  const transaction: Transaction = await sequelize.transaction();
  
  try {
    const userId = req.user!.id;
    const { productId, quantity } = req.body;
    
    // Check if product exists and is in stock
    const product = await Product.findByPk(productId);
    
    if (!product) {
      await transaction.rollback();
      return next(new NotFoundError('Product not found'));
    }
    
    if (!product.inStock) {
      await transaction.rollback();
      return next(new BadRequestError('Product is out of stock'));
    }
    
    // Check if item already exists in cart
    let cartItem = await CartItem.findOne({
      where: { userId, productId },
      transaction,
    });
    
    if (cartItem) {
      // Update quantity if item exists
      await cartItem.update(
        { quantity: cartItem.quantity + quantity },
        { transaction }
      );
    } else {
      // Create new cart item
      cartItem = await CartItem.create(
        {
          userId,
          productId,
          quantity,
        },
        { transaction }
      );
    }
    
    await transaction.commit();
    
    // Get updated cart item with product details
    const updatedCartItem = await CartItem.findByPk(cartItem.id, {
      include: [
        {
          model: Product,
          as: 'product',
          attributes: ['id', 'name', 'price', 'images', 'category', 'subCategory', 'specifications', 'inStock', 'discount'],
        },
      ],
    });
    
    res.status(201).json({
      success: true,
      message: 'Item added to cart',
      data: updatedCartItem,
    });
  } catch (error) {
    await transaction.rollback();
    next(error);
  }
};

/**
 * Update cart item quantity
 */
export const updateCartItem = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;
    const itemId = req.params.itemId;
    const { quantity } = req.body;
    
    // Find the cart item
    const cartItem = await CartItem.findOne({
      where: { id: itemId, userId },
    });
    
    if (!cartItem) {
      return next(new NotFoundError('Cart item not found'));
    }
    
    // Update the quantity
    await cartItem.update({ quantity });
    
    // Get updated cart item with product details
    const updatedCartItem = await CartItem.findByPk(cartItem.id, {
      include: [
        {
          model: Product,
          as: 'product',
          attributes: ['id', 'name', 'price', 'images', 'category', 'subCategory', 'specifications', 'inStock', 'discount'],
        },
      ],
    });
    
    res.json({
      success: true,
      message: 'Cart item updated',
      data: updatedCartItem,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Remove item from cart
 */
export const removeCartItem = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;
    const itemId = req.params.itemId;
    
    // Find the cart item
    const cartItem = await CartItem.findOne({
      where: { id: itemId, userId },
    });
    
    if (!cartItem) {
      return next(new NotFoundError('Cart item not found'));
    }
    
    // Delete the cart item
    await cartItem.destroy();
    
    res.json({
      success: true,
      message: 'Item removed from cart',
      data: { id: itemId },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Clear user's cart
 */
export const clearCart = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;
    
    // Delete all cart items for the user
    await CartItem.destroy({
      where: { userId },
    });
    
    res.json({
      success: true,
      message: 'Cart cleared successfully',
    });
  } catch (error) {
    next(error);
  }
}; 