
require("node:dns").setServers(["8.8.8.8", "1.1.1.1"]);
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const Product = require("./models/Product");
const Order = require("./models/Order");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Home route
app.get("/", (req, res) => {
  res.send("URBAN CROWN Backend is running!");
});

// Test API route
app.get("/api/test", (req, res) => {
  res.json({
    success: true,
    message: "URBAN CROWN API is working!"
  });
});

// Database status
app.get("/api/db-status", (req, res) => {
  const connected = mongoose.connection.readyState === 1;

  res.status(connected ? 200 : 503).json({
    success: connected,
    database: connected ? "Connected" : "Not connected"
  });
});

// Get all products
app.get("/api/products", async (req, res) => {
  try {
    const products = await Product.find();
    res.json({ success: true, products });
  } catch (error) {
    console.error("Products fetch error:", error.message);
    res.status(500).json({
      success: false,
      message: "Products fetch nahi ho sake."
    });
  }
});

// Add a new product
app.post("/api/products", async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json({ success: true, product });
  } catch (error) {
    console.error("Product create error:", error.message);
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

// Get all orders
app.get("/api/orders", async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json({ success: true, orders });
  } catch (error) {
    console.error("Orders fetch error:", error.message);
    res.status(500).json({
      success: false,
      message: "Orders fetch nahi ho sake."
    });
  }
});

// Create a new order
app.post("/api/orders", async (req, res) => {
  try {
    const order = await Order.create(req.body);
    res.status(201).json({
      success: true,
      message: "Order successfully save ho gaya!",
      order
    });
  } catch (error) {
    console.error("Order create error:", error.message);
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

// Start server first so hosting can detect its port
app.listen(PORT, "0.0.0.0", () => {
  console.log(`URBAN CROWN backend running on port ${PORT}`);

  // Connect to MongoDB after the server starts
  if (!process.env.MONGODB_URI) {
    console.error("MONGODB_URI environment variable missing!");
    return;
  }

  mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
      console.log("MongoDB connected successfully!");
    })
    .catch((error) => {
      console.error("MongoDB connection error:", error.message);
    });
});
