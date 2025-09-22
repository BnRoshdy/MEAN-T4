
const express = require("express");
const router = express.Router();
const {addUser,deleteUserbyID, getUserbyID,getallUsers,loginUser}=require('../controllers/userscontroller')
const  { authMiddleware, restrictTo }=require('../auth/auth')


router.post("/register",addUser)
router.post("/login",loginUser)
router.get("/getAllUsers",authMiddleware,restrictTo ("admin"),getallUsers)
router.get("/users/:userID",authMiddleware,restrictTo ("admin"),getUserbyID)
router.delete("/users/:userID",authMiddleware,restrictTo ("admin"),deleteUserbyID)



module.exports=router;