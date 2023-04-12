const db = require("../config/Config.js");
const item = db.item;
const { order } = require("../config/Config.js");
const path = require("path");

// Task no.8 (First check how pagination used and implemented, then implement pagination in current get APIs.)
// Task no.9 (If limit/record is not given then get 10 records default)
// Task no.10 (Get next 10 records by page numbers)
//Task no. 11   Sorting based on Date, "expiryDate" - oldest comes first in Item get all api

const getItem = async (req, res) => {
  try {
    let whereobj = {};
    let limit = req.query.limit || 10;
    let offset = req.query.offset || 1;
    let finaloffset = (offset - 1) * limit;
    whereobj.limit = parseInt(limit);
    whereobj.offset = finaloffset;
    if (req.query.order && req.query.order == "DESC") {
      whereobj.order = [["expiryDate", "DESC"]];
    }
    let data = await item.findAll(whereobj);
   if(data.length){
     return res.status(200).send({ status : true , records :data });
   }else{
     return res.status(200).send({status : true , message : res.__("RECORDS_NOT_FOUND...")})
   }
  } catch (error) {
    console.log(error);
    return res.status(400).send({status : false ,message : error.message})
  }
};

// create item


const createItem = async (req, res) => {
  try {
    if (req.user.role == "Admin" || req.user.role == "Manufacturer") {
      let body = req.body;
      let data = await item.create({
        itemName: body.itemName,
        price: body.price,
        expiryDate: body.expiryDate,
        manufature_id: body.manufature_id,
        item_image: body.item_image,
      });
      return res.status(200).send({ status : true , records :data });
    } else {
      res.json({ message: res.__("CAN'T_ACCESS_FOR_INSERT_RECORD") });
    }
  } catch (error) {
    console.log(error);
    return res.status(400).send({status : false , message : error.message})
  }
};

//Task no.22 (Add restriction that only admin and manufacturer can Add and update Item)

const updateItem = async (req, res) => {
  try {
    if (req.user.role == "Admin" || req.user.role == "Manufacturer") {
      let body = req.body;
      let data = await item.update(
        {
          itemName: body.itemName,
          price: body.price,
          expiryDate: body.expiryDate,
          manufature_id: body.manufature_id,
          item_image: body.item_image,
        },
        { where: { id: req.params.id } }
      );
      return res.status(200).send({ status : true , records :data });
    } else {
      res.status(200).send({ status : true,message: res.__("CAN'T_ACCESS_FOR_UPDATE_RECORD") });
    }
  } catch (error) {
    console.log(error);
    return res.status(400).send({status : false ,message : error.message})
};
}
//Task no.33 (Add check in delete item api, that if item is exist in order table and it has status ordered then item can't be deleted)

const checkdelete = async (req, res) => {
  try {
    let data = await order.findOne({ where: { item_id: req.params.id } });
      console.log(!data);
       
    if(!data){
        return res.status(200).send({status : true,message : res.__("RECORDS_NOT_FOUND...")})
    }else{   
    if (data.status == "Ordered") {
      return res.status(200).send({ status : true,message: res.__("ITEM_NOT_DELETED!!!") });
    } else {
      let deletRecord = await item.destroy({ where: { id: data.item_id } });
      return res.status(200).send({status : true, message :res.__("ITEM_DELETED_SUCCESSFULLY...")});
    }
  }
  } catch (error) {
    console.log(error);
    return res.status(400).send({status : false ,message : error.message})
  }
};

//Task no. 45 (Add item image field, update in create and update item api.)

let imageInsert = async (req, res) => {
  try {
    return res.send(req.file);
  } catch (error) {
    console.log(error);
    return res.status(400).send({status : false ,message : error.message})
  }
};

module.exports = { getItem, createItem, updateItem, checkdelete, imageInsert };
