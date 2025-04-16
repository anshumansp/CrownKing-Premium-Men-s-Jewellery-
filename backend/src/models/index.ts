import User from './user.model';

// Export all models
export {
  User,
};

// Define model associations here when more models are added
// For example:
// User.hasMany(Order);
// Order.belongsTo(User);

// Synchronize models with database
export const syncModels = async (force = false): Promise<void> => {
  try {
    await Promise.all([
      User.sync({ force }),
      // Add other models here
    ]);
    console.log('Models synchronized with database');
  } catch (error) {
    console.error('Error synchronizing models:', error);
    throw error;
  }
}; 