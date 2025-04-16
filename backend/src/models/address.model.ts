import { Model, DataTypes, Optional } from 'sequelize';
import sequelize from '../config/db';
import User from './user.model';

// Address interface based on API contract
export interface AddressAttributes {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  phone: string;
  email?: string;
  isDefault: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

// For creating a new Address with optional ID
interface AddressCreationAttributes extends Optional<AddressAttributes, 'id'> {}

// Address model class
class Address extends Model<AddressAttributes, AddressCreationAttributes> implements AddressAttributes {
  public id!: string;
  public userId!: string;
  public firstName!: string;
  public lastName!: string;
  public address!: string;
  public city!: string;
  public state!: string;
  public zipCode!: string;
  public country!: string;
  public phone!: string;
  public email?: string;
  public isDefault!: boolean;

  // Timestamps
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

// Initialize Address model
Address.init(
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
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    address: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    city: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    state: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    zipCode: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    country: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        isEmail: true,
      },
    },
    isDefault: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    sequelize,
    modelName: 'Address',
    tableName: 'addresses',
    timestamps: true,
    indexes: [
      {
        fields: ['userId'],
      },
    ],
  }
);

// Setup associations
Address.belongsTo(User, {
  foreignKey: 'userId',
  as: 'user',
});

User.hasMany(Address, {
  foreignKey: 'userId',
  as: 'addresses',
});

export default Address; 