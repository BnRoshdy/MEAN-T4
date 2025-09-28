const mongoose = require('mongoose');
const { Schema } = mongoose;

const orderSchema = new Schema(
  {
    userId: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
      required: true
    },
    cartItems: [
      {
        productId: {
          type: mongoose.Types.ObjectId,
          ref: 'Product',
          required: true
        },
        quantity: {
          type: Number,
          required: true,
          default: 1
        },
        price: {
          type: Number,
          required: true
        }
      }
    ],
    totalOrderPrice: {
      type: Number,
      required: true
    },
    shippingAddress: {
      street: { type: String, required: true },
      city: { type: String, required: true },
      phone: { type: String, required: true }
    },
    paymentMethod: {
      type: String,
      enum: ['card', 'cash'],
      default: 'cash'
    },
    isPaid: {
      type: Boolean,
      default: false
    },
    paidAt: Date,
    isDelivered: {
      type: Boolean,
      default: false
    },
    deliveredAt: Date
  },
  {
    collection: 'Order',
    timestamps: true
  }
);

const orderModel = mongoose.model('Order', orderSchema);
module.exports = orderModel;
