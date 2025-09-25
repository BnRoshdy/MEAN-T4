const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  products: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
        min: 1,
      },
      productData: {
        name: String,
        price: Number,
        category: String,
        description: String,
        brand: String,
        images: [String],
      },
    },
  ],
});

module.exports = mongoose.model("Cart", cartSchema);
