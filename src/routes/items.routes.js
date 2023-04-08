const express = require('express')
const router = express.Router()
const {getItem,createItem,updateItem,checkdelete,imageInsert} = require("../controller/item.controllers.js")
const {celebrate} = require("celebrate")
const {creatItemvalid,updateItemvalid,deletevalid} = require('../validator/items.validator.js')
const userAuth = require("../middleware/user.auth.js")
const fileUpload = require('../middleware/fileUpload.js')



router.route("/").get(getItem)

  // create item
router.route("/create").post(celebrate(creatItemvalid),userAuth,createItem)

   
//update item
router.put("/update/:id",celebrate(updateItemvalid),userAuth,updateItem)

router.delete("/checkdelete/:id",celebrate(deletevalid),checkdelete)

// insert image
router.post("/uploads",fileUpload,imageInsert)


module.exports = router