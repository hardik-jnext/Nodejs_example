const { order,item } = require("../config/Config");
const generateOrderNumber = require("../helpers/orderNumber.helper.js");

// only my orders

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

// all orders

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

// create order

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
