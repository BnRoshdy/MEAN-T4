const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    productData: {
      name: { type: String, required: true },
      description: { type: String },
      price: { type: Number, required: true },
      category: { type: String },
      brand: { type: String },
      images: { type: [String], default: [] },
      sku: { type: String },
      featured: { type: Boolean, default: false },
    },
    quantity: {
      type: Number,
      default: 1,
    },
  },
  { timestamps: true }
);

const Cart = mongoose.model("Cart", cartSchema);

module.exports = Cart;
