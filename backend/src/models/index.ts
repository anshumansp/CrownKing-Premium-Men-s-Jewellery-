import sequelize from '../config/db';
import User from './user.model';
import Product from './product.model';
import Order from './order.model';
import CartItem from './cart.model';
import Review from './review.model';
import Address from './address.model';

// Sync models with the database
export const syncModels = async (force = false): Promise<void> => {
  try {
    await Promise.all([
      User.sync({ force }),
      Product.sync({ force }),
      Order.sync({ force }),
      CartItem.sync({ force }),
      Review.sync({ force }),
      Address.sync({ force }),
    ]);
    console.log(`Models synchronized with database ${force ? '(tables recreated)' : ''}`);
  } catch (error) {
    console.error('Error synchronizing models:', error);
    throw error;
  }
};

export {
  sequelize,
  User,
  Product,
  Order,
  CartItem,
  Review,
  Address,
};

export default {
  sequelize,
  User,
  Product,
  Order,
  CartItem,
  Review,
  Address,
}; 