import { Model, DataTypes, Optional } from 'sequelize';
import sequelize from '../config/db';
import User from './user.model';
import Product from './product.model';

// Review interface based on API contract
export interface ReviewAttributes {
  id: string;
  userId: string;
  productId: string;
  rating: number;
  comment: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// For creating a new Review with optional ID
interface ReviewCreationAttributes extends Optional<ReviewAttributes, 'id'> {}

// Review model class
class Review extends Model<ReviewAttributes, ReviewCreationAttributes> implements ReviewAttributes {
  public id!: string;
  public userId!: string;
  public productId!: string;
  public rating!: number;
  public comment!: string;

  // Timestamps
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

// Initialize Review model
Review.init(
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
    rating: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1,
        max: 5,
      },
    },
    comment: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'Review',
    tableName: 'reviews',
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
Review.belongsTo(User, {
  foreignKey: 'userId',
  as: 'user',
});

Review.belongsTo(Product, {
  foreignKey: 'productId',
  as: 'product',
});

User.hasMany(Review, {
  foreignKey: 'userId',
  as: 'userReviews',
});

Product.hasMany(Review, {
  foreignKey: 'productId',
  as: 'productReviews',
});

export default Review; 