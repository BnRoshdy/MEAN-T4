const express = require("express");
const router = express.Router();
const {add_category,allCategories}=require('../controllers/categorycontroller')
// const { isAdmin } = require("../middleware/auth");

router.post("/addCategory", add_category);
router.get("/allCategories", allCategories);


module.exports = router;
