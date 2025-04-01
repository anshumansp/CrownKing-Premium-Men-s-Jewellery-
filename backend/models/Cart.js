const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

const Cart = sequelize.define(
  "Cart",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      unique: true,
      references: {
        model: "Users",
        key: "id",
      },
    },
    items: {
      type: DataTypes.JSONB,
      defaultValue: [],
    },
    total: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0,
    },
  },
  {
    indexes: [
      {
        fields: ["userId"],
      },
    ],
  }
);

module.exports = Cart;
