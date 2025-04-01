const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Product = require("../models/Product");

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

// Get cart items
router.get("/", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate("cart.productId");
    res.json(user.cart);
  } catch (error) {
    res.status(500).json({ message: "Error fetching cart" });
  }
});

// Add item to cart
router.post("/", auth, async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    // Check if product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Check if product is in stock
    if (!product.inStock) {
      return res.status(400).json({ message: "Product is out of stock" });
    }

    // Update user's cart
    const user = await User.findById(req.user._id);
    const existingItem = user.cart.find(
      (item) => item.productId.toString() === productId
    );

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      user.cart.push({
        productId,
        quantity,
      });
    }

    await user.save();
    res.json(user.cart);
  } catch (error) {
    res.status(500).json({ message: "Error adding to cart" });
  }
});

// Update cart item quantity
router.put("/:productId", auth, async (req, res) => {
  try {
    const { quantity } = req.body;
    const user = await User.findById(req.user._id);

    const item = user.cart.find(
      (item) => item.productId.toString() === req.params.productId
    );

    if (!item) {
      return res.status(404).json({ message: "Item not found in cart" });
    }

    item.quantity = quantity;
    await user.save();
    res.json(user.cart);
  } catch (error) {
    res.status(500).json({ message: "Error updating cart" });
  }
});

// Remove item from cart
router.delete("/:productId", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    user.cart = user.cart.filter(
      (item) => item.productId.toString() !== req.params.productId
    );

    await user.save();
    res.json(user.cart);
  } catch (error) {
    res.status(500).json({ message: "Error removing from cart" });
  }
});

// Clear cart
router.delete("/", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    user.cart = [];
    await user.save();
    res.json({ message: "Cart cleared successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error clearing cart" });
  }
});

module.exports = router;
