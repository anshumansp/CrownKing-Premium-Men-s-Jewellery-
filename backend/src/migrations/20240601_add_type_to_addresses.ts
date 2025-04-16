import { QueryInterface, DataTypes } from 'sequelize';

// Migration to add type column to addresses table
module.exports = {
  up: async (queryInterface: QueryInterface) => {
    // Add ENUM type if it doesn't exist
    await queryInterface.sequelize.query(
      `CREATE TYPE "enum_addresses_type" AS ENUM ('shipping', 'billing');`
    ).catch(() => {
      // Type might already exist, which is fine
      console.log('ENUM type already exists or another error occurred');
    });

    // Add type column
    await queryInterface.addColumn('addresses', 'type', {
      type: DataTypes.ENUM('shipping', 'billing'),
      allowNull: false,
      defaultValue: 'shipping',
    });

    // Add composite index
    await queryInterface.addIndex('addresses', ['userId', 'type']);
  },

  down: async (queryInterface: QueryInterface) => {
    // Remove index
    await queryInterface.removeIndex('addresses', ['userId', 'type']);
    
    // Remove column
    await queryInterface.removeColumn('addresses', 'type');
    
    // Drop ENUM type (optional)
    await queryInterface.sequelize.query(
      `DROP TYPE IF EXISTS "enum_addresses_type";`
    ).catch(() => {
      // It's okay if this fails
      console.log('Failed to drop ENUM type');
    });
  },
}; 