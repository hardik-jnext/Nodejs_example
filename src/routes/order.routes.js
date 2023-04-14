const express = require("express");
const router = express.Router();
const {
  getOrder,
  createOrder,
  getallOrder,
  updateOrderstatus,
  invoiceGenration,
  payment
} = require("../controller/order.controllers.js");
const userauth = require("../middleware/user.auth.js");
const {
  ordervalid,
  createOrdervalid,
  updateordervalid,
} = require("../validator/order.validator.js");
const { celebrate, Joi, errors, Segments } = require("celebrate");
const body = require("body-parser")


/**
 *@swagger
 * componenets :
 *  schemas:
 *    item:
 *        type: object
 *        properties:
 *         id:
 *            type: integer
 *         user_id:
 *            type: integer
 *         item_id:
 *            type: integer
 *         status :
 *            type: string
 *         order_no:
 *            typr: string
 */

// only my orders

/**
 * @swagger
 * /order/viewMyOrders:
 *     get:
 *      tags:
 *        - Orders
 *      security:
 *         - bearerAuth: []
 *      summary: only my orders
 *      description: only my orders
 *      parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *         description: Give order status
 *      responses:
 *          200:
 *            description : only my orders
 *            content:
 *              application/json:
 *                schema:
 *                   type: array
 *
 */

router.get("/viewMyOrders", celebrate(ordervalid), userauth, getOrder);

// get all orders

/**
 * @swagger
 * /order/viewallOrders:
 *     get:
 *      tags:
 *        - Orders
 *      security:
 *         - bearerAuth: []
 *      summary: only all orders
 *      description: only all orders if user is admin
 *      responses:
 *          200:
 *            description : only all orders
 *            content:
 *              application/json:
 *                schema:
 *                   type: array
 *
 */

router.get("/viewallOrders", userauth, getallOrder);

// create order

/**
 * @swagger
 * /order/createorder:
 *     post:
 *       tags:
 *         - Orders
 *       security:
 *         - bearerAuth: []
 *       summary: create order
 *       description: create order
 *       requestBody:
 *           required: true
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                     item_id:
 *                       type: integer
 *                     status:
 *                       type: string
 *       responses:
 *          200:
 *            description : order created
 *            content:
 *              application/json:
 *                schema:
 *                   type: array
 *
 */

router.post("/createorder", celebrate(createOrdervalid), userauth, createOrder);

// update order

/**
 * @swagger
 * /order/updatestatus/{id}:
 *     put:
 *      tags:
 *        - Orders
 *      security:
 *         - bearerAuth: []
 *      summary: update order status
 *      description: update order status
 *      parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Numeric ID of the user to update
 *         schema:
 *           type: integer
 *      requestBody:
 *          required: true
 *          content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                     status:
 *                       type: string
 *                     item_id:
 *                       type: integer
 *      responses:
 *          200:
 *            description : updated order status
 *            content:
 *              application/json:
 *                schema:
 *                   type: array
 *
 */

router.put(
  "/updatestatus/:id",
  celebrate(updateordervalid),
  userauth,
  updateOrderstatus
);

// invoice generate

/**
 * @swagger
 * /order/invoice:
 *     get:
 *      tags:
 *        - Orders
 *      security:
 *         - bearerAuth: []
 *      summary: invoice
 *      description: generate invoice
 *      responses:
 *          200:
 *            description : generate invoice
 *            content:
 *              application/json:
 *                schema:
 *                   type: array
 *
 */

router.get("/invoice", userauth, invoiceGenration);


//stripe payment


router.post("/payment", body.raw({type: 'application/json'}),payment)


module.exports = router;
