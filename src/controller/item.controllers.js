const db = require("../config/Config.js");
const item = db.item;
const { Op } = require("sequelize");
const { order } = require("../config/Config.js");
const path = require("path")

// pagination

const getItem = async (req, res) => {
  try {
    let data = await item.findAll({ order: [["expiryDate", "DESC"]] });
    return res.send({ data });
  } catch (e) {
    res.send(e);
  }
};

const createItem = async (req, res) => {
  try {
    if (req.user.role == "Admin" || req.user.role == "Manufacturer") {
      let body = req.body;
      let data = await item.create({
        itemName: body.itemName,
        price: body.price,
        expiryDate : body.expiryDate,
        manufature_id :body.manufature_id,
        item_image : body.item_image
      });
      return res.send({ data });
    } else {
      res.json({ message: res.__("CAN'T_ACCESS_FOR_INSERT_RECORD" )});
    }
  } catch (e) {
    res.send(e);
  }
};

const updateItem = async (req, res) => {
  try {
    if (req.user.role == "Admin" || req.user.role == "Manufacturer") {
    let body = req.body;
    let data = await item.update({ itemName: body.itemName ,price :body.price,expiryDate : body.expiryDate,manufature_id :body.manufature_id,item_image :body.item_image},{where:{id : req.params.id}});
    return res.send({data})
    }else{
      res.json({ message: res.__("CAN'T_ACCESS_FOR_UPDATE_RECORD") });
    }
  } catch (e) {
    res.send(e);
  }
};


// check delete item api

const checkdelete = async(req,res)=>{

    let data  = await order.findOne({ where :{item_id :req.params.id}})
    console.log(data.status) 
    if(data.status == "Ordered")
    {
    res.json({message :res.__("ITEM_NOT_DELETED!!!")})
    }else{
       let deletRecord  = await item.destroy({ where :{id :data.item_id}})
        return  res.json(deletRecord)  
    }
} 


//Insert image 
 
 let imageInsert = async(req,res)=>{
      return res.send(req.file)
 }

module.exports = { getItem, createItem,updateItem,checkdelete,imageInsert};
