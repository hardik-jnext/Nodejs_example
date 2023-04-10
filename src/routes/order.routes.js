const express = require('express')
const router = express.Router()
const {getOrder,createOrder,getallOrder,updateOrderstatus,invoiceGenration} = require("../controller/order.controllers.js")
const userauth = require("../middleware/user.auth.js")
const {ordervalid,createOrdervalid,updateordervalid} = require('../validator/order.validator.js')
const {celebrate,Joi,errors,Segments} = require('celebrate')


          // only my orders
router.get("/viewMyOrders",celebrate(ordervalid),userauth,getOrder)
            
         // get all orders
router.get("/viewallOrders",userauth,getallOrder)

         // create order
router.post("/createorder",celebrate(createOrdervalid),userauth,createOrder)

        // update order
router.put("/updatestatus/:id",celebrate(updateordervalid),userauth,updateOrderstatus)

        // invoice generate
router.get("/invoice",userauth,invoiceGenration)
 
module.exports = router