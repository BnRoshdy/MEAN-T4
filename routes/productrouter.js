const express = require("express");
const router = express.Router();
const {get_all_products,get_product_byId,delete_product_id,edit_product_id,add_product,get_all_categories_products,get_all_brands,update_stock_product}=require('../controllers/productsController')




router.get("/all_products",get_all_products)
router.get("/product/:id",get_product_byId)
router.post("/product",add_product)
router.put("product/:id",edit_product_id)
router.delete("/product/:id",delete_product_id)
router.get("/categories", get_all_categories_products)
router.get("/brands",get_all_brands)
router.patch("/product/:id/stock",update_stock_product) 

module.exports = router;
