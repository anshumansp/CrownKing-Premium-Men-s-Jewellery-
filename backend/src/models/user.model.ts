import { DataTypes, Model, Optional } from 'sequelize';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import sequelize from '../config/db';

// User attributes interface
export interface UserAttributes {
  id: string;
  name: string;
  email: string;
  password: string;
  role: 'user' | 'admin';
  resetPasswordToken?: string;
  resetPasswordExpire?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

// User creation attributes interface (for optional fields)
export interface UserCreationAttributes extends Optional<UserAttributes, 'id'> {}

// User model class
class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
  public id!: string;
  public name!: string;
  public email!: string;
  public password!: string;
  public role!: 'user' | 'admin';
  public resetPasswordToken?: string;
  public resetPasswordExpire?: Date;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // Sign JWT and return
  public getSignedJwtToken(): string {
    return jwt.sign(
      { id: this.id, email: this.email, role: this.role },
      env.JWT_SECRET,
      {
        expiresIn: '30d',
      }
    );
  }

  // Match user entered password to hashed password in database
  public async matchPassword(enteredPassword: string): Promise<boolean> {
    return await bcrypt.compare(enteredPassword, this.password);
  }
}

// Initialize User model
User.init(
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
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM('user', 'admin'),
      defaultValue: 'user',
    },
    resetPasswordToken: {
      type: DataTypes.STRING,
    },
    resetPasswordExpire: {
      type: DataTypes.DATE,
    },
  },
  {
    sequelize,
    modelName: 'User',
    tableName: 'users',
    hooks: {
      // Hash password before saving
      beforeCreate: async (user: User) => {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
      },
      // Hash password before updating if changed
      beforeUpdate: async (user: User) => {
        if (user.changed('password')) {
          const salt = await bcrypt.genSalt(10);
          user.password = await bcrypt.hash(user.password, salt);
        }
      },
    },
  }
);

export default User; 