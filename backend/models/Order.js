const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

const Order = sequelize.define(
  "Order",
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
        model: "Users",
        key: "id",
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
    shippingAddress: {
      type: DataTypes.JSONB,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM(
        "pending",
        "processing",
        "shipped",
        "delivered",
        "cancelled"
      ),
      defaultValue: "pending",
    },
    paymentStatus: {
      type: DataTypes.ENUM("pending", "completed", "failed", "refunded"),
      defaultValue: "pending",
    },
    paymentMethod: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    paymentIntentId: {
      type: DataTypes.STRING,
    },
    trackingNumber: {
      type: DataTypes.STRING,
    },
    estimatedDelivery: {
      type: DataTypes.DATE,
    },
    notes: {
      type: DataTypes.TEXT,
    },
  },
  {
    indexes: [
      {
        fields: ["userId"],
      },
      {
        fields: ["status"],
      },
      {
        fields: ["paymentStatus"],
      },
    ],
  }
);

module.exports = Order;
