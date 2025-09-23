const orderModel=require('../models/orders');
const cartModel=require('../models/cartmodel')


const getAllOrders=async(req,res)=>{
    try{
    let order= await orderModel.find({userId:req.user._id})
    res.status(200).json({message:"success",data:order})
    }
    catch(err){
        res.status(500).json({message:err.message})
    }
}

const getSpecificOrder=async(req,res)=>{
    let id = req.params.id
    try{
    let order= await orderModel.findOne({userId:req.user._id,_id:id})
    res.status(200).json({message:"success",data:order})
    }
    catch(err){
        res.status(500).json({message:err.message})
    }
}


//under construction
const createCashOrder=async(req,res)=>{
    let id=req.params.id
    try{
    //1) get cart(cartId)
    const cart=await cartModel.findById(id);
    if (!cart) {
        return res.status(404).json({ message: "Cart not found" });
    }

    //2) calc total price
    //ternary operator
    const totalOrderPrice=cart.totalPriceAfterDiscount?
    cart.totalPriceAfterDiscount:cart.totalPrice

    //3) create order
    const order=await orderModel.create({
        userId:req.user._id,
        cartItems:cart.cartItems,
        totalOrderPrice,
        shippingAddress:req.body.shippingAddress
    })

    //4) increment sold & decrement quantity
    if (order){
        let options=cart.cartItems.map((item)=>({
            updateOne:{
                filter:{_id:item.productId},
                update:{$inc:{quantity:-item.quantity}}
            },
        }));

        await products.bulkWrite(options)
         //5) clear user cart
        await cartModel.findByIdAndDelete(req.params.id)
        return res.status(201).json({message:"Success",data:order})
    }
}
catch(err){
    res.status(500).json({message:err.message})
}
}


//payment method uder planing and construction


module.exports={createCashOrder,getSpecificOrder,getAllOrders}
