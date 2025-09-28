const express = require("express");
const router = express.Router();
const {add_category,allCategories}=require('../controllers/categorycontroller')
const {authMiddleware,restrictTo }=require('../auth/auth')

router.post("/addCategory",authMiddleware,restrictTo ("admin"), add_category);
router.get("/allCategories",authMiddleware,restrictTo ("admin","user"), allCategories);

//whole categories part not liked and used by products

module.exports = router;
