const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
      
    name: {
      type: String,
      // required: true,
    },

    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product", 
      required: true,
    },

    quantity: {
      type: Number,
      default: 1,
    },


    // cartItems: [
      //   {
      //       productId: {
      //           type: mongoose.Schema.ObjectId,
      //           ref: "product",
      //       },
      //       quantity: {
      //           type: Number,
      //           default: 1,
      //       },
      //       price: Number,
      //   },
      //   ],
      //   totalPrice: Number,
      //   totalPriceAfterDiscount: Number,
      //   discount:Number,

  },
  { timestamps: true }
);

const Cart = mongoose.model("Cart", cartSchema);

module.exports = Cart;
