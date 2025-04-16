import { QueryInterface, DataTypes } from 'sequelize';

// Migration to add googleId column to users table
module.exports = {
  up: async (queryInterface: QueryInterface) => {
    await queryInterface.addColumn('users', 'googleId', {
      type: DataTypes.STRING,
      allowNull: true,
    });
  },

  down: async (queryInterface: QueryInterface) => {
    await queryInterface.removeColumn('users', 'googleId');
  },
}; 