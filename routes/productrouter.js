const express = require("express");
const router = express.Router();
const {get_all_products,get_product_byId,delete_product_id,edit_product_id,add_product,get_all_categories_products,get_all_brands,update_stock_product}=require('../controllers/productsController')
const  { authMiddleware, restrictTo }=require('../auth/auth')




router.get("/",authMiddleware,get_all_products)
router.get("/products/:id",authMiddleware,restrictTo ("admin","user"),get_product_byId)
router.post("/product",authMiddleware,restrictTo ("admin"),add_product)
router.put("/product/:id",authMiddleware,restrictTo ("admin"),edit_product_id)
router.delete("/products/:id",authMiddleware,delete_product_id)
router.get("/categories",authMiddleware,restrictTo ("admin","user"), get_all_categories_products)
router.get("/brands",authMiddleware,restrictTo ("admin","user"),get_all_brands)
router.patch("/product/:id/stock",authMiddleware,restrictTo ("admin"),update_stock_product) 

module.exports = router;
