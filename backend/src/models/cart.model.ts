import { Model, DataTypes, Optional } from 'sequelize';
import sequelize from '../config/db';
import User from './user.model';
import Product from './product.model';

// Cart item interface based on API contract
export interface CartItemAttributes {
  id: string;
  userId: string;
  productId: string;
  quantity: number;
  createdAt?: Date;
  updatedAt?: Date;
}

// For creating a new CartItem with optional ID
interface CartItemCreationAttributes extends Optional<CartItemAttributes, 'id'> {}

// Cart item model class
class CartItem extends Model<CartItemAttributes, CartItemCreationAttributes> implements CartItemAttributes {
  public id!: string;
  public userId!: string;
  public productId!: string;
  public quantity!: number;

  // Timestamps
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

// Initialize CartItem model
CartItem.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: User,
        key: 'id',
      },
    },
    productId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: Product,
        key: 'id',
      },
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
      validate: {
        min: 1,
      },
    },
  },
  {
    sequelize,
    modelName: 'CartItem',
    tableName: 'cart_items',
    timestamps: true,
    indexes: [
      {
        fields: ['userId'],
      },
      {
        fields: ['productId'],
      },
      {
        unique: true,
        fields: ['userId', 'productId'],
      },
    ],
  }
);

// Setup associations
CartItem.belongsTo(User, {
  foreignKey: 'userId',
  as: 'user',
});

CartItem.belongsTo(Product, {
  foreignKey: 'productId',
  as: 'product',
});

User.hasMany(CartItem, {
  foreignKey: 'userId',
  as: 'cartItems',
});

Product.hasMany(CartItem, {
  foreignKey: 'productId',
  as: 'cartItems',
});

export default CartItem; 