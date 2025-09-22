const express = require("express");
const router = express.Router();
const {add_to_cart,showCart,edit_quantity_cart,delete_cart}=require('../controllers/cartcontroller')



router.post('/addcart', add_to_cart)
router.get('/allcart', showCart)
router.patch('/edit_cart/:id',edit_quantity_cart)
router.delete('/edit_cart/:id', delete_cart)






//  authMiddleware,retrictTo("user", "admin"),
// authMiddleware,retrictTo("user", "admin"),
//  authMiddleware,retrictTo("user", "admin"),
// authMiddleware,retrictTo("user", "admin"),


module.exports=router