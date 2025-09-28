const orderModel = require("../models/ordermodel");
const cartModel = require("../models/cartmodel");
const productModel = require("../models/productmodel");

const getAllOrders = async (req, res) => {
  try {
    const orders = await orderModel.find({ userId: req.user.id });
    res.status(200).json({ message: "success", data: orders });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getSpecificOrder = async (req, res) => {
  try {
    const id = req.params.id;
    const order = await orderModel.findOne({ userId: req.user.id, _id: id });
    if (!order) return res.status(404).json({ message: "Order not found" });
    res.status(200).json({ message: "success", data: order });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const createCashOrder = async (req, res) => {
  try {
    const cartId = req.params.id;
    const cart = await cartModel.findById(cartId);

    if (!cart) return res.status(404).json({ message: "Cart not found" });

    if (!cart.products || cart.products.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    const cartItems = cart.products.map((item) => ({
      productId: item.productId,
      quantity: item.quantity,
      price: item.productData.price,
    }));

    const totalOrderPrice = cartItems.reduce(
      (sum, item) => sum + item.quantity * item.price,
      0
    );

    const order = await orderModel.create({
      userId: req.user.id,
      cartItems,
      totalOrderPrice,
      shippingAddress: req.body.shippingAddress,
      paymentMethod: "cash",
    });

    for (const item of cart.products) {
      await productModel.findByIdAndUpdate(item.productId, {
        $inc: { stock: -item.quantity, sold: item.quantity },
      });
    }

    await cartModel.findByIdAndDelete(cartId);

    res.status(201).json({
      message: "Order created successfully",
      data: order,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  createCashOrder,
  getSpecificOrder,
  getAllOrders,
};
