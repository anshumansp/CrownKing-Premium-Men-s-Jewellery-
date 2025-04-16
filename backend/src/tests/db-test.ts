import { Product, User } from '../models';
import { testConnection } from '../config/db';

async function testDatabase() {
  try {
    // Test connection
    await testConnection();
    console.log('Connected to database successfully');
    
    // Query products
    console.log('Querying products...');
    const products = await Product.findAll();
    console.log(`Found ${products.length} products:\n`);
    
    // Log the raw product data
    console.log('Raw product data:');
    console.log(JSON.stringify(products, null, 2));
    
    // Query users
    console.log('\nQuerying users...');
    const users = await User.findAll({
      attributes: { exclude: ['password'] } // Exclude sensitive info
    });
    console.log(`Found ${users.length} users:\n`);
    
    // Log the raw user data
    console.log('Raw user data:');
    console.log(JSON.stringify(users, null, 2));
    
    console.log('\nDatabase test completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error testing database:', error);
    process.exit(1);
  }
}

// Run the test
testDatabase(); 