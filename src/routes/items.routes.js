const express = require('express')
const router = express.Router()
const {getItem,createItem,updateItem,checkdelete,imageInsert} = require("../controller/item.controllers.js")
const {celebrate} = require("celebrate")
const {creatItemvalid,updateItemvalid,deletevalid} = require('../validator/items.validator.js')
const userAuth = require("../middleware/user.auth.js")
const fileUpload = require('../middleware/fileUpload.js')



/**
 *@swagger
 * componenets :
 *  schemas:
 *    item:
 *        type: object
 *        properties:
 *         id:
 *            type: integer
 *         itemName: 
 *            type: string
 *         price:
 *            type: integer
 *         manufature_id :
 *            type: integer 
 *         expiryDate:
 *            type: string
 *            format: date
 *         item_image:
 *            typr: string
 */   



     // get item
/**
* @swagger
* /item/all-items:
*     get:
*      tags:
*         - Items
*      summary: get all users
*      parameters:
*        - in: query
*          name: limit
*          schema:
*          type: string
*          description: page size
*        -  in: query
*           name: offset
*           schema:
*           type: string
*           description: page number
*        -  in: query
*           name: order
*           schema:
*           type: string
*           description: order
*      responses:
*          200:
*            description : list of register user
*            content:
*              application/json:
*                schema:
*                   type: array
*      
*/    

router.route("/all-items").get(getItem)


// create item

/**
* @swagger
* /item/createitem:
*     post:
*       tags:
*         - Items
*       security:
*          - bearerAuth: []
*       summary: create item
*       description: create item
*       requestBody:
*           required: true
*           content:
*             application/json:
*               schema:
*                 type: object
*                 properties:
*                     itemName:
*                       type: string
*                     price:
*                      type: integer
*                     expiryDate:
*                      type: string
*                      format : data
*                     manufature_id:
*                      type: integer
*                     item_image:
*                      type: string               
*       responses:
*          200:
*            description : created itemr
*            content:
*              application/json:
*                schema:
*                   type: array
*      
*/

router.route("/createitem").post(celebrate(creatItemvalid),userAuth,createItem)

   
//update item

/**
* @swagger
* /item/update/{id}:
*     put:
*      tags:
*        - Items
*      security:
*         - bearerAuth: []
*      summary: item Update with  authentication
*      description: item Update with  authentication   
*      parameters:
*       - in: path
*         name: id
*         required: true
*         description: find with item id
*         schema:
*           type: integer 
*      requestBody:
*          required: true
*          content:
*             application/json:
*               schema:
*                 type: object
*                 properties:
*                     userName:
*                       type: string
*                     email: 
*                       type: string 
*                     age:
*                      type: integer
*                     address:
*                      type: string
*      responses:
*          200:
*            description : update item
*            content:
*              application/json:
*                schema:
*                   type: array
*      
*/ 

router.put("/update/:id",celebrate(updateItemvalid),userAuth,updateItem)

           
/**
* @swagger
* /item/checkdelete/{id}:
*     delete:
*      tags:
*        - Items
*      summary: item delete 
*      description: item delete if item is exist in order table and it has status ordered then item can't be deleted   
*      parameters:
*       - in: path
*         name: id
*         required: true
*         description: find with item id
*         schema:
*           type: integer 
*      responses:
*          200:
*            description : delete item
*            content:
*              application/json:
*                schema:
*                   type: array
*      
*/

router.delete("/checkdelete/:id",celebrate(deletevalid),checkdelete)



// insert image
router.post("/uploads",fileUpload,imageInsert)


module.exports = router