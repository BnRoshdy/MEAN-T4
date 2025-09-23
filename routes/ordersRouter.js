const express=require('express')
const router=express.Router()

const  { authMiddleware, restrictTo }=require('../auth/auth')

let {createCashOrder,getSpecificOrder,getAllOrders}=require('../controllers/orders')

router.get('/all',authMiddleware,restrictTo('user'),getAllOrders)
router.post('/orders/:id',authMiddleware,restrictTo('user'),createCashOrder)
router.get('/specific/:id',authMiddleware,restrictTo('user'),getSpecificOrder)


module.exports=router
