const express = require('express')
const router = express.Router()
const {getOrder,createOrder,getallOrder,updateOrderstatus,invoiceGenration} = require("../controller/order.controllers.js")
const userauth = require("../middleware/user.auth.js")
const {ordervalid,createOrdervalid,updateordervalid} = require('../validator/order.validator.js')
const {celebrate,Joi,errors,Segments} = require('celebrate')

router.get("/viewMyOrders",celebrate(ordervalid),userauth,getOrder)

router.get("/viewallOrders",userauth,getallOrder)
router.put("/updatestatus/:id",celebrate(updateordervalid),userauth,updateOrderstatus)
router.post("/createorder",celebrate(createOrdervalid),userauth,createOrder)
router.get("/invoice",userauth,invoiceGenration)
 
module.exports = router