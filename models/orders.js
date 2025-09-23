const mongoose = require('mongoose');
const {Schema} = mongoose;
const orderSchema = new Schema({
    userId: {
        type: mongoose.Types.ObjectId,
        ref: 'user'
    },
    cartItems:
        {
            productId:{
                type: mongoose.Types.ObjectId,
                ref: 'product'
            },
            quantity: Number,
            price: Number
        },
    totalOrderPrice: Number,
    shippingAddress: {
        street: String,
        city: String,
        phone: String,
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
    deliveredAt: Date,
},{
    collection:"Order",
    timestamps:true
});

const orderModel=mongoose.model('Order', orderSchema);
module.exports=orderModel;
