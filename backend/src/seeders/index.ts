import { seedProducts } from './products.seeder';
import { sequelize } from '../models';

export const runSeeders = async (force = false): Promise<void> => {
  try {
    console.log('Running database seeders...');
    
    // Run seeders in sequence
    await seedProducts();
    
    console.log('Database seeding completed successfully.');
  } catch (error) {
    console.error('Error running seeders:', error);
    throw error;
  }
};

// Run seeders if called directly
if (require.main === module) {
  // Force parameter can be passed as command line arg
  const force = process.argv.includes('--force');
  
  runSeeders(force)
    .then(() => {
      console.log('Seeders completed successfully.');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Error running seeders:', error);
      process.exit(1);
    });
} 