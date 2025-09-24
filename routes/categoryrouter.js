const express = require("express");
const router = express.Router();
const {add_category,allCategories}=require('../controllers/categorycontroller')
<<<<<<< HEAD
const {authMiddleware,restrictTo }=require('../auth/auth')

router.post("/addCategory",authMiddleware,restrictTo ("admin"), add_category);
router.get("/allCategories",authMiddleware,restrictTo ("admin","user"), allCategories);
=======
// const { isAdmin } = require("../middleware/auth");

router.post("/addCategory", add_category);
router.get("/allCategories", allCategories);


>>>>>>> products
module.exports = router;
