const { order,item } = require("../config/Config");
const generateOrderNumber = require("../helpers/orderNumber.helper.js");


// Task no.15 (Create getAll my orders API for current logged in user) 
// Note : Task no. 16 (Add status in order. Decide data type ) in model
//Task no.18 (Add filter by status in viewMyOrders api )


const getOrder = async (req, res) => {
  try {
    let selectRecords = await order.findAll({
      include: {
        model: item,
        attributes: ["itemName", "price"],
      },
      where: {
        user_id: req.user.id,
        status: req.query.status,
      },
    });
    if (selectRecords && selectRecords[0]) {
      res.send(selectRecords);
    } else {
      res.json({ message: res.__("STATUS_NOT_FOUND...") });
    }
  } catch (error) {
    console.log(error);
  }
};

//Task no.17 (Add separate getAll API to show all orders) 

const getallOrder = async (req, res) => {
  try {
    let selectRecords = await order.findAll({
      include: {
        model: item,
        attributes: ["itemName", "price"],
      },
    });
    res.send(selectRecords);
  } catch (error) {
    console.log(error);
  }
};


//Task no.14 (Add create order API )
//Task no.23 (Check if Item expiry date is today or before today then it can't be ordered by user)
//Task np.24 Set if customer is creating order then you have to accept status "Ordered" only

const createOrder = async (req, res) => {
  try {
    let checkItem = await item.findOne({ where: { id: req.body.item_id } });
    if (checkItem) {
      if (new Date(checkItem.expiryDate) < new Date()) {
        res.json({ message: res.__("ITEM_EXPIRED!!!") });
      } else {
        if (req.user.role == "Customer" && req.body.status == "Ordered") {
          if (req.user.status == "InActive") {
            return res.json({
              message: res.__(
                "YOUR_STATUS_IS_INACTIVE_PLEASE_VERIFY_YOUR_EMAIL_ADRESS"
              ),
            });
          }
          let insertRecords = await order.create({
            user_id: req.user.id,
            item_id: req.body.item_id,
            status: req.body.status,
            order_no: generateOrderNumber,
          });
          res.send(insertRecords);
        } else {
          res.json({ message: res.__("YOU_ARE_NOT_CUSTOMER") });
        }
      }
    } else {
      res.json({ message: res.__("ITEM_NOT-FOUND...") });
    }
  } catch (error) {
    console.log(error);
  }
};


//Task no 25.(Create new API for update orderStatus. )
//Task no 26.(Create new API for update item, can be access by Manufacturer or Admin only)

const updateOrderstatus = async (req, res) => {
  try {
    if (req.user.role == "Admin" || req.user.role == "Manufacturer") {
      const updatestatus = await order.update(
        { status: req.body.status },
        { where: { id: req.params.id } }
      );
      res.send({ updatestatus });
    } else if (req.user.role == "Customer") {
      if (req.body.status == "Ordered" || req.body.status == "Canceled") {
        const updatestatus = await order.update(
          { status: req.body.status },
          { where: { user_id: req.params.id } }
        );
        res.send({ updatestatus });
      } else {
        res.json({ messsage: res.__("CAN'T_ACCESS!!!") });
      }
    }
  } catch (error) {
    res.send(error);
  }
};


//Task no.27 (Create invoice generation API for customer for ordered amount and items)

const invoiceGenration = async (req, res) => {
  try {
    const data = await order.findOne({
      include: {
        model: item,
        attributes: ["itemName", "price"],
      },
    });
    let obj = {
      id: data.id,
      item_id: data.item_id,
      itemName: data.item.itemName,
      price: data.item.price,
    };
    return res.send(obj);
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  getOrder,
  createOrder,
  getallOrder,
  updateOrderstatus,
  invoiceGenration,
};
