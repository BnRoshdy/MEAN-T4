
const Cart=require('../models/cartmodel')
// const Product=require('../models/product')
const add_to_cart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    if (!productId || !quantity) {
      return res.status(400).json({ message: "productId and quantity required" });
    }

    // const product = await Product.findById(productId);
    // if (!product) {
    //   return res.status(404).json({ message: "Product not found" });
    // }

    let cartItem = await Cart.findOne({ userId: req.user.id, productId });

    if (cartItem) {
      cartItem.quantity += quantity;
      await cartItem.save();
    } else {
      cartItem = await Cart.create({
        userId: req.user.id,
        productId,
        quantity,
        // name: product.name 
      });
    }

    res.status(201).json({ message: "Item added to cart", cartItem });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

const showCart=async(req,res)=>{
    try {
const cart=await Cart.find()
if(cart.length === 0){
 return res.status(404).json({message:"no thing in cart"})

}
res.status(200).json({cart})
        
    } catch (err) {
        return res.status(404).json({message:message.err})
    }
}


const edit_quantity_cart=async(req,res)=>{
  try {

  const id=req.params.id
const updated_quantity_cart = {};
    if (req.body.quantity) updated_quantity_cart.quantity = req.body.quantity;
const current_cart= await Cart.findByIdAndUpdate(id,updated_quantity_cart,{ new: true })

if(!current_cart){
      return res.status(402).json({message:"not found"})

}
    res.status(200).json({current_cart})

  } catch (err) {
    return res.status(401).json({message:"no updated allowed"})
  }
}

const delete_cart = async (req, res) => {
  try {
    const id = req.params.id;

    const deleted_cart = await Cart.findByIdAndDelete(id);

    if (!deleted_cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    res.status(200).json({ message: "Cart deleted successfully", deleted_cart });
  } catch (err) {
    return res.status(500).json({ message: "Delete not allowed", error: err.message });
  }
};

module.exports={add_to_cart,showCart,edit_quantity_cart,delete_cart}