const Cart = require('../models/cartmodel');
const Product = require('../models/productmodel');

const add_to_cart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    if (!productId || !quantity) {
      return res.status(400).json({ message: "productId and quantity required" });
    }

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: "Product not found" });
    if (product.stock < quantity) return res.status(400).json({ message: "Not enough stock available" });

    let cartItem = await Cart.findOne({ userId: req.user.id, productId });

    if (cartItem) {
      if (product.stock < cartItem.quantity + quantity) {
        return res.status(400).json({ message: "Not enough stock available" });
      }
      cartItem.quantity += quantity;
      cartItem.productData = {
        name: product.name,
        price: product.price,
        category: product.category,
        description: product.description,
        brand: product.brand,
        images: product.images
      };
      await cartItem.save();
    } else {
      cartItem = await Cart.create({
        userId: req.user.id,
        productId,
        quantity,
        productData: {
          name: product.name,
          price: product.price,
          category: product.category,
          description: product.description,
          brand: product.brand,
          images: product.images
        }
      });
    }

    product.stock -= quantity;
    await product.save();

    res.status(201).json({ message: "Product added to cart successfully", cartItem });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

const showCart = async (req, res) => {
  try {
    const cart = await Cart.find({ userId: req.user.id }).populate('productId');
    if (cart.length === 0) return res.status(404).json({ message: "Nothing in cart" });

    res.status(200).json({ cart });
  } catch (err) {
    res.status(500).json({ message: "Error fetching cart", error: err.message });
  }
};

const edit_quantity_cart = async (req, res) => {
  try {
    const id = req.params.id;
    const { quantity } = req.body;

    const cartItem = await Cart.findById(id);
    if (!cartItem) return res.status(404).json({ message: "Cart item not found" });

    const product = await Product.findById(cartItem.productId);
    if (!product) return res.status(404).json({ message: "Product not found" });

    const diff = quantity - cartItem.quantity;
    if (diff > 0 && product.stock < diff) return res.status(400).json({ message: "Not enough stock" });

    cartItem.quantity = quantity;
    cartItem.productData = {
      name: product.name,
      price: product.price,
      category: product.category,
      description: product.description,
      brand: product.brand,
      images: product.images
    };
    await cartItem.save();

    product.stock -= diff;
    await product.save();

    res.status(200).json({ message: "Cart updated successfully", cartItem });
  } catch (err) {
    res.status(500).json({ message: "Update not allowed", error: err.message });
  }
};

const delete_cart = async (req, res) => {
  try {
    const id = req.params.id;
    const cartItem = await Cart.findById(id);
    if (!cartItem) return res.status(404).json({ message: "Cart item not found" });

    const product = await Product.findById(cartItem.productId);
    if (product) {
      product.stock += cartItem.quantity;
      await product.save();
    }

    await cartItem.deleteOne();
    res.status(200).json({ message: "Cart deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Delete not allowed", error: err.message });
  }
};

module.exports = { add_to_cart, showCart, edit_quantity_cart, delete_cart };
