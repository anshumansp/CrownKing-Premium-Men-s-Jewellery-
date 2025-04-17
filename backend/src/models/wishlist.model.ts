import { Model, DataTypes, Optional } from 'sequelize';
import sequelize from '../config/db';
import User from './user.model';
import Product from './product.model';

// Wishlist item interface
export interface WishlistItemAttributes {
  id: string;
  userId: string;
  productId: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// For creating a new WishlistItem with optional ID
interface WishlistItemCreationAttributes extends Optional<WishlistItemAttributes, 'id'> {}

// Wishlist item model class
class WishlistItem extends Model<WishlistItemAttributes, WishlistItemCreationAttributes> implements WishlistItemAttributes {
  public id!: string;
  public userId!: string;
  public productId!: string;

  // Timestamps
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

// Initialize WishlistItem model
WishlistItem.init(
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
  },
  {
    sequelize,
    modelName: 'WishlistItem',
    tableName: 'wishlist_items',
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
WishlistItem.belongsTo(User, {
  foreignKey: 'userId',
  as: 'user',
});

WishlistItem.belongsTo(Product, {
  foreignKey: 'productId',
  as: 'product',
});

User.hasMany(WishlistItem, {
  foreignKey: 'userId',
  as: 'wishlistItems',
});

Product.hasMany(WishlistItem, {
  foreignKey: 'productId',
  as: 'wishlistItems',
});

export default WishlistItem; 