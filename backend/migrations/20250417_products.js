'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('products', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      price: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
      },
      images: {
        type: Sequelize.ARRAY(Sequelize.STRING),
        defaultValue: [],
      },
      category: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      subCategory: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      specifications: {
        type: Sequelize.JSONB,
        allowNull: false,
        defaultValue: {},
      },
      rating: {
        type: Sequelize.DECIMAL(3, 1),
        defaultValue: 0,
      },
      reviews: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      inStock: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
      },
      featured: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      discount: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });

    // Add indexes
    await queryInterface.addIndex('products', ['category']);
    await queryInterface.addIndex('products', ['subCategory']);
    await queryInterface.addIndex('products', ['name']);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('products');
  },
}; 