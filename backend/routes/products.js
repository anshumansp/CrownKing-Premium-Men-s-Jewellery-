const express = require("express");
const router = express.Router();
const Product = require("../models/Product");

// Get all products with filtering and pagination
router.get("/", async (req, res) => {
  try {
    const {
      category,
      subCategory,
      minPrice,
      maxPrice,
      featured,
      sort,
      page = 1,
      limit = 12,
    } = req.query;

    const query = {};

    // Apply filters
    if (category) query.category = category;
    if (subCategory) query.subCategory = subCategory;
    if (featured) query.featured = featured === "true";
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    // Apply sorting
    let sortOption = {};
    if (sort) {
      switch (sort) {
        case "price-asc":
          sortOption = { price: 1 };
          break;
        case "price-desc":
          sortOption = { price: -1 };
          break;
        case "rating-desc":
          sortOption = { rating: -1 };
          break;
        default:
          sortOption = { createdAt: -1 };
      }
    }

    // Execute query with pagination
    const products = await Product.find(query)
      .sort(sortOption)
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit));

    // Get total count for pagination
    const total = await Product.countDocuments(query);

    res.json({
      products,
      total,
      pages: Math.ceil(total / Number(limit)),
      currentPage: Number(page),
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching products" });
  }
});

// Get single product
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: "Error fetching product" });
  }
});

// Create product (admin only)
router.post("/", async (req, res) => {
  try {
    const product = new Product(req.body);
    await product.save();
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ message: "Error creating product" });
  }
});

// Update product (admin only)
router.put("/:id", async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: "Error updating product" });
  }
});

// Delete product (admin only)
router.delete("/:id", async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting product" });
  }
});

module.exports = router;
