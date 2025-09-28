const express=require('express')
const router=express.Router()

const  { authMiddleware, restrictTo }=require('../auth/auth')

let {createCashOrder,getSpecificOrder,getAllOrders}=require('../controllers/ordercontroller')

router.get('/all',authMiddleware,restrictTo('user','admin'),getAllOrders)
router.post('/orders/:id',authMiddleware,restrictTo('user','admin'),createCashOrder)
router.get('/specific/:id',authMiddleware,restrictTo('user',"admin"),getSpecificOrder)


module.exports=router