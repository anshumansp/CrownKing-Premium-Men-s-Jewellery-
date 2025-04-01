const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Product = sequelize.define('Product', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  images: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    allowNull: false
  },
  category: {
    type: DataTypes.STRING,
    allowNull: false
  },
  subCategory: {
    type: DataTypes.STRING
  },
  specifications: {
    type: DataTypes.JSONB
  },
  rating: {
    type: DataTypes.DECIMAL(3, 2),
    defaultValue: 0
  },
  reviews: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  inStock: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  featured: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  discount: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  sku: {
    type: DataTypes.STRING,
    unique: true
  },
  weight: {
    type: DataTypes.DECIMAL(10, 2)
  },
  dimensions: {
    type: DataTypes.JSONB
  },
  materials: {
    type: DataTypes.ARRAY(DataTypes.STRING)
  },
  warranty: {
    type: DataTypes.STRING
  },
  tags: {
    type: DataTypes.ARRAY(DataTypes.STRING)
  }
}, {
  indexes: [
    {
      fields: ['category']
    },
    {
      fields: ['subCategory']
    },
    {
      fields: ['featured']
    },
    {
      fields: ['inStock']
    }
  ]
});

module.exports = Product; 