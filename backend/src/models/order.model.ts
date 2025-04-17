import { Model, DataTypes, Optional } from 'sequelize';
import sequelize from '../config/db';
import User from './user.model';

// Define shipping address interface
interface ShippingAddress {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

// Define order item interface
interface OrderItem {
  id?: string;
  name: string;
  price: number;
  quantity: number;
  images: string[];
  category?: string;
  subCategory?: string;
  specifications?: {
    [key: string]: string;
  };
  productId?: string;
  discount?: number;
}

// Order interface based on API contract
export interface OrderAttributes {
  id: string;
  userId: string;
  items: OrderItem[];
  total: number;
  subtotal: number;
  shippingCost: number;
  shippingMethod: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  shippingAddress: ShippingAddress;
  paymentDetails?: {
    cardNumber: string;
    expiryDate: string;
    cvv: string;
    nameOnCard: string;
  };
  paymentIntentId?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// For creating a new Order with optional ID
interface OrderCreationAttributes extends Optional<OrderAttributes, 'id'> {}

// Order model class
class Order extends Model<OrderAttributes, OrderCreationAttributes> implements OrderAttributes {
  public id!: string;
  public userId!: string;
  public items!: OrderItem[];
  public total!: number;
  public subtotal!: number;
  public shippingCost!: number;
  public shippingMethod!: string;
  public status!: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  public shippingAddress!: ShippingAddress;
  public paymentDetails?: {
    cardNumber: string;
    expiryDate: string;
    cvv: string;
    nameOnCard: string;
  };
  public paymentIntentId?: string;

  // Timestamps
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

// Initialize Order model
Order.init(
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
    items: {
      type: DataTypes.JSONB,
      allowNull: false,
    },
    total: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    subtotal: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    shippingCost: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    shippingMethod: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM('pending', 'processing', 'shipped', 'delivered', 'cancelled'),
      defaultValue: 'pending',
    },
    shippingAddress: {
      type: DataTypes.JSONB,
      allowNull: false,
    },
    paymentDetails: {
      type: DataTypes.JSONB,
      allowNull: true,
    },
    paymentIntentId: {
      type: DataTypes.UUID,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: 'Order',
    tableName: 'orders',
    timestamps: true,
    indexes: [
      {
        fields: ['userId'],
      },
      {
        fields: ['status'],
      },
      {
        fields: ['createdAt'],
      },
    ],
  }
);

// Setup associations
Order.belongsTo(User, {
  foreignKey: 'userId',
  as: 'user',
});

User.hasMany(Order, {
  foreignKey: 'userId',
  as: 'orders',
});

export default Order; 