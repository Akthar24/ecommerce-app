const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Product = require("../models/Product");
const Order = require("../models/Order");

router.post("/order", async (req, res) => {
  try {
    const { userId, items } = req.body;
    const user = await User.findById(userId);
    let totalAmount = 0;
    for (let item of items) {
      const product = await Product.findById(item.productId);
      if (!product) {
        throw new Error(`Product with id ${item.productId} not found`);
      }
      totalAmount += product.price * item.quantity;
    }
    const newOrder = new Order({
      user: user._id,
      items,
      totalAmount,
      status: "Pending",
    });
    await newOrder.save();
    res.status(201).json(newOrder);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;