const db = require("../config/Config.js");
const item = db.item;
const { Op } = require("sequelize");
const { order } = require("../config/Config.js");
const path = require("path")



// Task no.8 (First check how pagination used and implemented, then implement pagination in current get APIs.)

const getItem = async (req, res) => {
  let limit = req.query.limit;
  let offset = req.query.offset || 1;
  let finaloffset = (offset - 1) * limit;
  let data = await item.findAll({ limit: parseInt(limit), offset: finaloffset });
  return res.send({ data });
};


// Task no.9 (If limit/record is not given then get 10 records default)

// const getItem = async (req, res) => {
//   let limit = req.query.limit || 10
//   let offset = req.query.offset || 1;
//   let finaloffset = (offset - 1) * limit;
//     let data = await item.findAll({ limit: parseInt(limit), offset: finaloffset });
//     return res.send({ data });  
// };


// Task no.10 (Get next 10 records by page numbers)

// const getItem = async (req, res) => {
//   let limit =  10
//   let offset = req.query.offset || 1;
//   let finaloffset = (offset - 1) * limit; 
//     let data = await item.findAll({ limit: parseInt(limit), offset: finaloffset });
//     return res.send({ data });
  
// };

//Task no. 11   Sorting based on Date, "expiryDate" - oldest comes first in Item get all api

// const getItem = async (req, res) => {
//   try {
//     let data = await item.findAll({ order: [["expiryDate", "DESC"]] });
//     return res.send({ data });
//   } catch (e) {
//     res.send(e);
//   }
// };



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


//Task no.22 (Add restriction that only admin and manufacturer can Add and update Item)

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




//Task no.33 (Add check in delete item api, that if item is exist in order table and it has status ordered then item can't be deleted)

const checkdelete = async(req,res)=>{

  try { 
  let data  = await order.findOne({ where :{item_id :req.params.id}})
    console.log(data.status) 
    if(data.status == "Ordered")
    {
    res.json({message :res.__("ITEM_NOT_DELETED!!!")})
    }else{
       let deletRecord  = await item.destroy({ where :{id :data.item_id}})
        return  res.json(deletRecord)  
    }
  } catch (error) {
     console.log(error)
  }  

} 

//Task no. 45 (Add item image field, update in create and update item api.)
 
 let imageInsert = async(req,res)=>{
     try {
       return res.send(req.file)     
     } catch (error) {
      console.log(error)
     }
 }

module.exports = { getItem, createItem,updateItem,checkdelete,imageInsert};
