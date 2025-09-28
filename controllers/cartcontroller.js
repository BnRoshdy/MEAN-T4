const cartModel = require('../models/cartmodel');
const Product = require('../models/productmodel');
const mongoose = require("mongoose")



const addToCart = async (req, res) => {
  const { productId, quantity } = req.body;


  if (!productId || !quantity || quantity <= 0) {
    return res.status(400).json({ message: "Product ID and a valid quantity are required." });
  }

  try {

    const userId = req.user._id;
    const cart = await cartModel.findOne({ userId: userId });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found for this user." });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found." });
    }


    const existingProductInCart = cart.products.find(
      (item) => item.productData.toString() === productId
    );

    if (existingProductInCart) {

      existingProductInCart.quantity += quantity;
    } else {

      cart.products.push({
        productData: productId,
        quantity: quantity,

      });
    }


    await cart.save();


    res.status(200).json({
      message: "Product added to cart successfully.",
      updatedCart: cart
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};




const showCart = async (req, res) => {
  try {
    const userId = req.user._id;
    const cart = await cartModel.findOne({ userId: userId });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found for this user." });
    }

    res.status(200).json({ cart });
  } catch (err) {
    res.status(500).json({ message: "Error fetching cart", error: err.message });
  }
};




const deleteFromCart = async (req, res) => {
  const { Id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(Id)) {
    return res.status(400).json({ success: false, message: "Invalid product ID" })
  }
  try {

    const userId = req.user._id;
    const cart = await cartModel.findOne({ userId: userId });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found for this user." });
    }

    const updatedProducts = cart.products.filter(
      (item) => item.productData.toString() !== Id
    );


    if (updatedProducts.length === cart.products.length) {
      return res.status(404).json({ message: "Product not found in cart." });
    }


    cart.products = updatedProducts;

    await cart.save();


    res.status(200).json({
      message: "Product deleted from cart successfully.",
      updatedCart: cart
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};



module.exports = { addToCart, showCart, deleteFromCart };
