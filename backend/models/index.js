const User = require("./User");
const Product = require("./Product");
const Order = require("./Order");
const Cart = require("./Cart");

// User - Order relationship
User.hasMany(Order, { foreignKey: "userId" });
Order.belongsTo(User, { foreignKey: "userId" });

// User - Cart relationship
User.hasOne(Cart, { foreignKey: "userId" });
Cart.belongsTo(User, { foreignKey: "userId" });

module.exports = {
  User,
  Product,
  Order,
  Cart,
};
