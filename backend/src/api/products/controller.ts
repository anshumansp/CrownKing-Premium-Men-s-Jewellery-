import { Request, Response, NextFunction } from 'express';
import { Op } from 'sequelize';
import Product from '../../models/product.model';
import Review from '../../models/review.model';
import { ApiError } from '../../utils/errors';
import { cacheMiddleware } from '../../middleware/cache';
import { sequelize } from '../../models';

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 12;

/**
 * Get all products with pagination and filtering
 */
export const getProducts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const page = parseInt(req.query.page as string) || DEFAULT_PAGE;
    const limit = parseInt(req.query.limit as string) || DEFAULT_LIMIT;
    const offset = (page - 1) * limit;
    
    // Build filter conditions
    const whereClause: any = {};
    
    if (req.query.category) {
      whereClause.category = req.query.category;
    }
    
    if (req.query.subCategory) {
      whereClause.subCategory = req.query.subCategory;
    }
    
    if (req.query.minPrice || req.query.maxPrice) {
      whereClause.price = {};
      if (req.query.minPrice) {
        whereClause.price[Op.gte] = parseFloat(req.query.minPrice as string);
      }
      if (req.query.maxPrice) {
        whereClause.price[Op.lte] = parseFloat(req.query.maxPrice as string);
      }
    }
    
    if (req.query.minRating) {
      whereClause.rating = {
        [Op.gte]: parseFloat(req.query.minRating as string)
      };
    }
    
    // Handle sorting
    let order: any = [['createdAt', 'DESC']]; // default sort by newest
    
    if (req.query.sortBy) {
      switch (req.query.sortBy) {
        case 'price_asc':
          order = [['price', 'ASC']];
          break;
        case 'price_desc':
          order = [['price', 'DESC']];
          break;
        case 'rating':
          order = [['rating', 'DESC']];
          break;
        default:
          // Keep default
          break;
      }
    }
    
    const products = await Product.findAndCountAll({
      where: whereClause,
      limit,
      offset,
      order,
    });
    
    res.json({
      success: true,
      data: {
        products: products.rows,
        totalProducts: products.count,
        totalPages: Math.ceil(products.count / limit),
        currentPage: page,
        limit,
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Search products by name or description
 */
export const searchProducts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const query = req.query.query as string;
    const page = parseInt(req.query.page as string) || DEFAULT_PAGE;
    const limit = parseInt(req.query.limit as string) || DEFAULT_LIMIT;
    const offset = (page - 1) * limit;
    
    const products = await Product.findAndCountAll({
      where: {
        [Op.or]: [
          { name: { [Op.iLike]: `%${query}%` } },
          { description: { [Op.iLike]: `%${query}%` } },
        ],
      },
      limit,
      offset,
    });
    
    res.json({
      success: true,
      data: {
        products: products.rows,
        totalProducts: products.count,
        totalPages: Math.ceil(products.count / limit),
        currentPage: page,
        limit,
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get featured products
 */
export const getFeaturedProducts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const limit = parseInt(req.query.limit as string) || 8;
    
    const products = await Product.findAll({
      where: { featured: true },
      limit,
      order: [['createdAt', 'DESC']],
    });
    
    res.json({
      success: true,
      data: products,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get product by ID
 */
export const getProductById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const productId = req.params.id;
    
    const product = await Product.findByPk(productId);
    
    if (!product) {
      throw new ApiError('Product not found', 404);
    }
    
    // Get the product reviews count and average rating
    const reviewStats = await Review.findAll({
      attributes: [
        [sequelize.fn('COUNT', sequelize.col('id')), 'reviewCount'],
        [sequelize.fn('AVG', sequelize.col('rating')), 'averageRating'],
      ],
      where: { productId },
      raw: true,
    });
    
    res.json({
      success: true,
      data: {
        ...product.toJSON(),
        reviewStats: reviewStats[0],
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get product categories
 */
export const getProductCategories = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const categories = await Product.findAll({
      attributes: [
        [sequelize.fn('DISTINCT', sequelize.col('category')), 'category'],
      ],
      raw: true,
    });
    
    const subCategories = await Product.findAll({
      attributes: [
        'category',
        [sequelize.fn('DISTINCT', sequelize.col('subCategory')), 'subCategory'],
      ],
      raw: true,
      group: ['category', 'subCategory'],
    });
    
    // Format the result to show category and its subcategories
    const formattedCategories = categories.map((cat: any) => {
      return {
        name: cat.category,
        subCategories: subCategories
          .filter((subCat: any) => subCat.category === cat.category)
          .map((subCat: any) => subCat.subCategory),
      };
    });
    
    res.json({
      success: true,
      data: formattedCategories,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get reviews for a product
 */
export const getProductReviews = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const productId = req.params.productId;
    const page = parseInt(req.query.page as string) || DEFAULT_PAGE;
    const limit = parseInt(req.query.limit as string) || DEFAULT_LIMIT;
    const offset = (page - 1) * limit;
    
    // First check if product exists
    const product = await Product.findByPk(productId);
    
    if (!product) {
      throw new ApiError('Product not found', 404);
    }
    
    const reviews = await Review.findAndCountAll({
      where: { productId },
      limit,
      offset,
      order: [['createdAt', 'DESC']],
    });
    
    res.json({
      success: true,
      data: {
        reviews: reviews.rows,
        totalReviews: reviews.count,
        totalPages: Math.ceil(reviews.count / limit),
        currentPage: page,
        limit,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Create a review for a product
 */
export const createProductReview = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const productId = req.params.productId;
    const userId = req.user!.id;
    
    // Check if product exists
    const product = await Product.findByPk(productId);
    
    if (!product) {
      throw new ApiError('Product not found', 404);
    }
    
    // Check if user already reviewed this product
    const existingReview = await Review.findOne({
      where: { productId, userId },
    });
    
    if (existingReview) {
      throw new ApiError('You have already reviewed this product', 400);
    }
    
    // Create the review
    const review = await Review.create({
      userId,
      productId,
      rating: req.body.rating,
      title: req.body.title,
      content: req.body.content,
    });
    
    // Update product rating and review count
    const reviewStats = await Review.findAll({
      attributes: [
        [sequelize.fn('COUNT', sequelize.col('id')), 'reviewCount'],
        [sequelize.fn('AVG', sequelize.col('rating')), 'averageRating'],
      ],
      where: { productId },
      raw: true,
    });
    
    await product.update({
      rating: parseFloat((reviewStats[0] as any).averageRating) || 0,
      reviews: parseInt((reviewStats[0] as any).reviewCount) || 0,
    });
    
    res.status(201).json({
      success: true,
      data: review,
    });
  } catch (error) {
    next(error);
  }
}; 