import { Model, DataTypes, Optional } from 'sequelize';
import sequelize from '../config/db';

// Define specifications interface
interface Specifications {
  material: string;
  weight: string;
  dimensions: string;
  warranty: string;
  [key: string]: string;
}

// Product interface based on API contract
export interface ProductAttributes {
  id: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  category: string;
  subCategory: string;
  specifications: Specifications;
  rating: number;
  reviews: number;
  inStock: boolean;
  featured: boolean;
  discount: number;
  createdAt?: Date;
  updatedAt?: Date;
}

// For creating a new Product with optional ID
interface ProductCreationAttributes extends Optional<ProductAttributes, 'id'> {}

// Product model class
class Product extends Model<ProductAttributes, ProductCreationAttributes> implements ProductAttributes {
  public id!: string;
  public name!: string;
  public description!: string;
  public price!: number;
  public images!: string[];
  public category!: string;
  public subCategory!: string;
  public specifications!: Specifications;
  public rating!: number;
  public reviews!: number;
  public inStock!: boolean;
  public featured!: boolean;
  public discount!: number;

  // Timestamps
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

// Initialize Product model
Product.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    images: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      defaultValue: [],
    },
    category: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    subCategory: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    specifications: {
      type: DataTypes.JSONB,
      allowNull: false,
      defaultValue: {},
    },
    rating: {
      type: DataTypes.DECIMAL(3, 1),
      defaultValue: 0,
    },
    reviews: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    inStock: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    featured: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    discount: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
  },
  {
    sequelize,
    modelName: 'Product',
    tableName: 'products',
    timestamps: true,
    indexes: [
      {
        fields: ['category'],
      },
      {
        fields: ['subCategory'],
      },
      {
        fields: ['name'],
      },
    ],
  }
);

export default Product; 