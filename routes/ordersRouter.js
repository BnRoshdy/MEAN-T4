const express=require('express')
const router=express.Router()

const  { authMiddleware, restrictTo }=require('../auth/auth')

let {createCashOrder,getSpecificOrder,getAllOrders}=require('../controllers/orders')

router.get('/all',authMiddleware,restrictTo('admin'),getAllOrders)
router.post('/orders/:id',authMiddleware,restrictTo("admin",'user'),createCashOrder)
router.get('/specific/:id',authMiddleware,restrictTo('user',"admin"),getSpecificOrder)


module.exports=router