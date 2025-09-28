const express = require("express");
const router = express.Router();
const {addToCart,showCart, deleteFromCart}=require('../controllers/cartcontroller')
const {authMiddleware,restrictTo }=require('../auth/auth')


router.get('/allcart',authMiddleware,restrictTo ("admin","user"), showCart)
router.post("/addToCart",authMiddleware,restrictTo ("admin","user"),addToCart)
router.delete("/delete/:Id",authMiddleware,restrictTo ("admin","user"),deleteFromCart)


module.exports=router