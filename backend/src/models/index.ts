import sequelize from '../config/db';
import User from './user.model';
import Product from './product.model';
import Order from './order.model';
import CartItem from './cart.model';
import Review from './review.model';
import Address from './address.model';
import WishlistItem from './wishlist.model';

// Sync models with the database
export const syncModels = async (force = false): Promise<void> => {
  try {
    // First sync with force to recreate tables if needed
    if (force) {
      console.log('Dropping and recreating all tables...');
      await sequelize.sync({ force: true });
    } else {
      // Sync in correct order to respect dependencies
      console.log('Syncing models in dependency order...');
      
      // Step 1: First sync base models without dependencies
      console.log('Syncing base models...');
      await User.sync();
      await Product.sync();
      
      // Step 2: Then sync models that depend on Users
      console.log('Syncing user-dependent models...');
      await Address.sync();
      
      // Step 3: Then sync models that depend on both Users and Products
      console.log('Syncing models with multiple dependencies...');
      await CartItem.sync();
      await WishlistItem.sync();
      await Review.sync();
      await Order.sync();
      
      console.log('Model synchronization completed successfully');
    }
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
  WishlistItem,
};

export default {
  sequelize,
  User,
  Product,
  Order,
  CartItem,
  Review,
  Address,
  WishlistItem,
}; 