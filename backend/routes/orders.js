const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Product = require("../models/Product");
const Order = require("../models/Order");

// Middleware to verify token
const auth = async (req, res, next) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");
    if (!token) {
      return res
        .status(401)
        .json({ message: "No token, authorization denied" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: "Token is not valid" });
  }
};

// Create order
router.post("/", auth, async (req, res) => {
  try {
    const { shippingAddress, paymentMethod } = req.body;
    const user = await User.findById(req.user._id).populate("cart.productId");

    if (user.cart.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    // Calculate total and prepare order items
    let total = 0;
    const items = user.cart.map((item) => {
      const product = item.productId;
      total += product.price * item.quantity;
      return {
        productId: product._id,
        quantity: item.quantity,
        price: product.price,
      };
    });

    // Create order
    const order = new Order({
      userId: user._id,
      items,
      total,
      shippingAddress,
      paymentMethod,
    });

    await order.save();

    // Clear user's cart
    user.cart = [];
    await user.save();

    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ message: "Error creating order" });
  }
});

// Get user's orders
router.get("/my-orders", auth, async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user._id })
      .populate("items.productId")
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: "Error fetching orders" });
  }
});

// Get single order
router.get("/:id", auth, async (req, res) => {
  try {
    const order = await Order.findOne({
      _id: req.params.id,
      userId: req.user._id,
    }).populate("items.productId");

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: "Error fetching order" });
  }
});

// Update order status (admin only)
router.put("/:id/status", auth, async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    order.status = status;
    await order.save();
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: "Error updating order status" });
  }
});

// Cancel order
router.post("/:id/cancel", auth, async (req, res) => {
  try {
    const order = await Order.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (order.status !== "pending") {
      return res.status(400).json({ message: "Order cannot be cancelled" });
    }

    order.status = "cancelled";
    await order.save();
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: "Error cancelling order" });
  }
});

module.exports = router;
