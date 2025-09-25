const Cart = require('../models/cartmodel');
const Product = require('../models/productmodel');

const add_to_cart = async (req, res) => {
  try {
    const { products } = req.body; 
    if (!products || !Array.isArray(products)) {
      return res.status(400).json({ message: "Products array is required" });
    }

    let cart = await Cart.findOne({ userId: req.user.id });
    if (!cart) {
      cart = new Cart({ userId: req.user.id, products: [] });
    }

    for (const item of products) {
      const { productId, quantity } = item;

      const product = await Product.findById(productId);
      if (!product) continue;
      if (product.stock < quantity) {
        return res.status(400).json({ message: `Not enough stock for ${product.name}` });
      }

      const productInCart = cart.products.find(
        (p) => p.productId.toString() === productId
      );

      if (productInCart) {
        if (product.stock < productInCart.quantity + quantity) {
          return res.status(400).json({ message: `Not enough stock for ${product.name}` });
        }
        productInCart.quantity += quantity;
      } else {
        cart.products.push({
          productId,
          quantity,
          productData: {
            name: product.name,
            price: product.price,
            category: product.category,
            description: product.description,
            brand: product.brand,
            images: product.images,
          },
        });
      }

      product.stock -= quantity;
      await product.save();
    }

    await cart.save();
    res.status(201).json({ message: "Products added to cart successfully", cart });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

const showCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.user.id }).populate('products.productId');

    if (!cart || cart.products.length === 0) {
      return res.status(404).json({ message: "Nothing in cart" });
    }

    res.status(200).json({ cart });
  } catch (err) {
    res.status(500).json({ message: "Error fetching cart", error: err.message });
  }
};

const edit_quantity_cart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    if (!productId || !quantity) {
      return res.status(400).json({ message: "productId and quantity required" });
    }

    const cart = await Cart.findOne({ userId: req.user.id });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    const productInCart = cart.products.find(
      (item) => item.productId.toString() === productId
    );
    if (!productInCart) return res.status(404).json({ message: "Product not in cart" });

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: "Product not found" });

    const diff = quantity - productInCart.quantity;
    if (diff > 0 && product.stock < diff) {
      return res.status(400).json({ message: "Not enough stock" });
    }

    productInCart.quantity = quantity;
    productInCart.productData = {
      name: product.name,
      price: product.price,
      category: product.category,
      description: product.description,
      brand: product.brand,
      images: product.images,
    };

    product.stock -= diff;
    await product.save();
    await cart.save();

    res.status(200).json({ message: "Cart updated successfully", cart });
  } catch (err) {
    res.status(500).json({ message: "Update not allowed", error: err.message });
  }
};

const delete_product_cart = async (req, res) => {
  try {
    const { productId } = req.body;

    const cart = await Cart.findOne({ userId: req.user.id });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    const productIndex = cart.products.findIndex(
      (item) => item.productId.toString() === productId
    );
    if (productIndex === -1) return res.status(404).json({ message: "Product not in cart" });

    const productInCart = cart.products[productIndex];

    const product = await Product.findById(productInCart.productId);
    if (product) {
      product.stock += productInCart.quantity;
      await product.save();
    }

    cart.products.splice(productIndex, 1);
    await cart.save();

    res.status(200).json({ message: "Product removed from cart", cart });
  } catch (err) {
    res.status(500).json({ message: "Delete not allowed", error: err.message });
  }
};
const delete_whole_cart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.user.id });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    // نرجع الكميات لكل المنتجات اللي في الكارت
    for (const item of cart.products) {
      const product = await Product.findById(item.productId);
      if (product) {
        product.stock += item.quantity;
        await product.save();
      }
    }

    await cart.deleteOne();

    res.status(200).json({ message: "Cart deleted and stock restored" });
  } catch (err) {
    res.status(500).json({ message: "Delete not allowed", error: err.message });
  }
};


module.exports = { add_to_cart, showCart, edit_quantity_cart, delete_product_cart,delete_whole_cart };
