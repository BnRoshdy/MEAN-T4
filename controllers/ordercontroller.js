const orderModel = require("../models/ordermodel");
const cartModel = require("../models/cartmodel");
const UserModel = require("../models/usermodel");
const productModel = require("../models/productmodel");

const getAllOrders = async (req, res) => {
  try {
    const orders = await orderModel.find({ userId: req.user._id });
    res.status(200).json({ message: "success", data: orders });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


const createCashOrder = async (req, res) => {
  try {
    const userId = req.user._id;

   
    const cart = await cartModel.findOne({ userId: userId }).populate('products.productData');

    if (!cart) {
      return res.status(404).json({ message: "Cart not found." });
    }

    if (cart.products.length === 0) {
      return res.status(400).json({ message: "Cart is empty, cannot create an order." });
    }

    const purchasedItems = [];
    let totalOrderPrice = 0;

   
    for (const item of cart.products) {
      const productData = item.productData;

   
      if (!productData || productData.stock < item.quantity) {
        return res.status(400).json({ message: `Insufficient stock for product: ${productData.name}.` });
      }

      const itemPrice = productData.price * item.quantity;
      totalOrderPrice += itemPrice;


      purchasedItems.push({
        productId: productData._id,
        productname: productData.name,
        price: productData.price,
        quantity: item.quantity,
        totalPrice: itemPrice,
      });

  
      const updatedStock = productData.stock - item.quantity;
      await productModel.findByIdAndUpdate(productData._id, { stock: updatedStock });
    }


    const order = await orderModel.create({
      userId,
      purchasedItems,
      totalOrderPrice,
      shippingAddress: req.body.shippingAddress,
      paymentMethod: "cash",
      
    });

 
    await cartModel.findByIdAndUpdate(cart._id, { products: [] });

    res.status(201).json({
      message: "Order created successfully",
      data: order,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};



const getSpecificOrder = async (req, res) => {
  try {
    const id = req.params.id;
    const order = await orderModel.findOne({ userId: req.user._id, _id: id });
    if (!order) return res.status(404).json({ message: "Order not found" });
    res.status(200).json({ message: "success", data: order });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};



module.exports = {
  createCashOrder,
  getSpecificOrder,
  getAllOrders,
};
