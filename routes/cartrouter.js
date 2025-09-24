const express = require("express");
const router = express.Router();
const {add_to_cart,showCart,edit_quantity_cart,delete_cart}=require('../controllers/cartcontroller')
const {authMiddleware,restrictTo }=require('../auth/auth')


router.post('/addcart',authMiddleware,restrictTo ("admin","user"), add_to_cart)
router.get('/allcart',authMiddleware,restrictTo ("admin","user"), showCart)
router.patch('/edit_cart/:id',authMiddleware,restrictTo ("admin","user"),edit_quantity_cart)
router.delete('/delete_cart/:id',authMiddleware,restrictTo ("admin","user"), delete_cart)












module.exports=router