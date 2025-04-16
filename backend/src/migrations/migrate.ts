import { Sequelize } from 'sequelize';
import { env } from '../config/env';
import { QueryInterface, DataTypes } from 'sequelize';
import path from 'path';
import fs from 'fs';

// Sequelize instance
const sequelize = new Sequelize({
  dialect: 'postgres',
  host: env.DB_HOST,
  port: env.DB_PORT,
  username: env.DB_USER,
  password: env.DB_PASS,
  database: env.DB_NAME,
  logging: console.log,
});

async function runMigrations() {
  const queryInterface: QueryInterface = sequelize.getQueryInterface();

  try {
    console.log('Starting migrations...');
    
    // Get all migration files in the directory
    const migrationsDir = path.join(__dirname);
    const migrationFiles = fs.readdirSync(migrationsDir)
      .filter(file => 
        file.endsWith('.ts') && 
        file !== 'migrate.ts' && 
        !file.endsWith('.d.ts')
      )
      .sort(); // Sort to run in order
    
    console.log(`Found ${migrationFiles.length} migration files`);
    
    // Run each migration
    for (const file of migrationFiles) {
      console.log(`Running migration: ${file}`);
      
      // Dynamic import (works with both ESM and CommonJS)
      const migration = require(path.join(migrationsDir, file));
      
      // Run the migration
      await migration.up(queryInterface);
      
      console.log(`✅ Migration complete: ${file}`);
    }
    
    console.log('All migrations completed successfully! 🎉');
  } catch (error) {
    console.error('Error running migrations:', error);
  } finally {
    await sequelize.close();
  }
}

// Run migrations
runMigrations(); 