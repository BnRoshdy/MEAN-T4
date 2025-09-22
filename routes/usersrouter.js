
const express = require("express");
const router = express.Router();
const {addUser,deleteUserbyID, getUserbyID,getallUsers}=require('../controllers/userscontroller')



router.post("/addUser",addUser)
router.get("/getAllUsers",getallUsers)
router.get("/users/:userID",getUserbyID)
router.delete("/users/:userID",deleteUserbyID)



module.exports=router;