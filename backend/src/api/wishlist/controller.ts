import { Request, Response, NextFunction } from 'express';
import WishlistItem from '../../models/wishlist.model';
import Product from '../../models/product.model';
import { NotFoundError, BadRequestError, ConflictError } from '../../utils/errors';

/**
 * Get user's wishlist items
 */
export const getWishlist = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;
    
    // Get wishlist items with product details
    const wishlistItems = await WishlistItem.findAll({
      where: { userId },
      include: [
        {
          model: Product,
          as: 'product',
          attributes: ['id', 'name', 'price', 'images', 'category', 'subCategory', 'specifications', 'rating', 'reviews', 'inStock', 'discount'],
        },
      ],
    });
    
    res.json({
      success: true,
      data: {
        items: wishlistItems,
        totalItems: wishlistItems.length,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Add product to wishlist
 */
export const addToWishlist = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;
    const { productId } = req.body;
    
    // Check if product exists
    const product = await Product.findByPk(productId);
    
    if (!product) {
      return next(new NotFoundError('Product not found'));
    }
    
    // Check if item already exists in wishlist
    const existingItem = await WishlistItem.findOne({
      where: { userId, productId },
    });
    
    if (existingItem) {
      return next(new ConflictError('Product already in wishlist'));
    }
    
    // Create new wishlist item
    const wishlistItem = await WishlistItem.create({
      userId,
      productId,
    });
    
    // Get the created wishlist item with product details
    const createdItem = await WishlistItem.findByPk(wishlistItem.id, {
      include: [
        {
          model: Product,
          as: 'product',
          attributes: ['id', 'name', 'price', 'images', 'category', 'subCategory', 'specifications', 'rating', 'reviews', 'inStock', 'discount'],
        },
      ],
    });
    
    res.status(201).json({
      success: true,
      message: 'Product added to wishlist',
      data: createdItem,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Remove product from wishlist
 */
export const removeFromWishlist = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;
    const productId = req.params.productId;
    
    // Check if item exists in wishlist
    const wishlistItem = await WishlistItem.findOne({
      where: { userId, productId },
    });
    
    if (!wishlistItem) {
      return next(new NotFoundError('Product not found in wishlist'));
    }
    
    // Delete the wishlist item
    await wishlistItem.destroy();
    
    res.json({
      success: true,
      message: 'Product removed from wishlist',
      data: { productId },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Clear wishlist
 */
export const clearWishlist = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;
    
    // Delete all wishlist items for the user
    await WishlistItem.destroy({
      where: { userId },
    });
    
    res.json({
      success: true,
      message: 'Wishlist cleared successfully',
    });
  } catch (error) {
    next(error);
  }
}; 