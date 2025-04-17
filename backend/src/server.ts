import app from './app';
import { env } from './config/env';
import { testConnection } from './config/db';
import { syncModels } from './models';
import { runSeeders } from './seeders';

// Start without database if in development mode and DB is not configured
if (env.NODE_ENV === 'development' && process.env.SKIP_DB === 'true') {
  // Start the server without database
  const server = app.listen(env.PORT, () => {
    console.log(`Server running in ${env.NODE_ENV} mode on port ${env.PORT}`);
    console.log(`Database connection skipped for development`);
    console.log(`Health check: http://localhost:${env.PORT}/health`);
  });

  // Handle unhandled promise rejections
  process.on('unhandledRejection', (err: Error) => {
    console.log(`Error: ${err.message}`);
    // Close server & exit process
    server.close(() => process.exit(1));
  });
} else {
  // Test database connection and sync models before starting the server
  (async () => {
    try {
      // Test database connection
      await testConnection();
      
      // Sync models with database
      const force = process.env.DB_SYNC_FORCE === 'true';
      await syncModels(force);
      
      // Run database seeders
      const shouldSeed = process.env.RUN_SEEDERS === 'true' || env.NODE_ENV === 'development';
      if (shouldSeed) {
        await runSeeders();
      }
      
      // Start the server
      const server = app.listen(env.PORT, () => {
        console.log(`Server running in ${env.NODE_ENV} mode on port ${env.PORT}`);
        console.log(`Health check: http://localhost:${env.PORT}/health`);
      });

      // Handle unhandled promise rejections
      process.on('unhandledRejection', (err: Error) => {
        console.log(`Error: ${err.message}`);
        // Close server & exit process
        server.close(() => process.exit(1));
      });
    } catch (err) {
      console.error('Failed to start server:', err);
      process.exit(1);
    }
  })();
} 