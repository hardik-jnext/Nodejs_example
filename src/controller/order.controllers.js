var Secret_Key = process.env.STRIPE_SECRET_KEY;
const stripe = require("stripe")(Secret_Key);
require("dotenv").config();
const { where } = require("sequelize");
const { order, item } = require("../config/Config");
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
      return res.status(200).send({ status: true, records: selectRecords });
    } else {
      return res
        .status(200)
        .send({ status: true, message: res.__("STATUS_NOT_FOUND...") });
    }
  } catch (error) {
    console.log(error);
    return res.status(400).send({ status: false, message: error.message });
  }
};

//Task no.17 (Add separate getAll API to show all orders)

const getallOrder = async (req, res) => {
  try {
    if (req.user.role == "Admin") {
      let selectRecords = await order.findAll({
        include: {
          model: item,
          attributes: ["itemName", "price"],
        },
      });
      if (selectRecords.length) {
        return res.status(200).send({ status: true, records: selectRecords });
      } else {
        return res
          .status(200)
          .send({ status: true, message: res.__("RECORDS_NOT_FOUND...") });
      }
    } else {
      return res
        .status(200)
        .send({ status: true, message: res.__("CAN'T_ACCESS!!!") });
    }
  } catch (error) {
    console.log(error);
    return res.status(400).send({ status: false, message: error.message });
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
        return res
          .status(200)
          .send({ stauts: false, error: res.__("ITEM_EXPIRED!!!") });
      } else {
        if (req.user.role == "Customer" && req.body.status == "Ordered") {
          if (req.user.status == "InActive") {
            return res.status(200).send({
              status: true,
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
          return res.status(200).send({ status: true, records: insertRecords });
        } else {
          return res
            .status(200)
            .send({ status: true, message: res.__("YOU_ARE_NOT_CUSTOMER") });
        }
      }
    } else {
      return res
        .status(200)
        .send({ status: true, message: res.__("ITEM_NOT-FOUND...") });
    }
  } catch (error) {
    console.log(error);
    return res.status(400).send({ status: false, message: error.message });
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
      res
        .stauts(200)
        .send({ status: true, message: res.__("STATUS_UPDATED...") });
    } else if (req.user.role == "Customer") {
      if (req.body.status == "Ordered" || req.body.status == "Canceled") {
        const updatestatus = await order.update(
          { status: req.body.status },
          { where: { user_id: req.params.id } }
        );
        res.status(200).send({ status: true, records: updatestatus });
      } else {
        res
          .status(200)
          .send({ status: true, messsage: res.__("CAN'T_ACCESS!!!") });
      }
    }
  } catch (error) {
    console.log(error);
    return res.status(400).send({ status: false, message: error.message });
  }
};

//Task no.27 (Create Invoice generation API for customer for ordered amount and items)

const invoiceGenration = async (req, res) => {
  try {
    if (req.user.role == "Admin") {
      const data = await order.findAll();
      return res.status(200).send({ status: true, record: data });
    } else {
      const data = await order.findAll(
        { where: { user_id: req.user.id } },
        {
          include: {
            model: item,
            attributes: ["itemName", "price"],
          },
        }
      );
      if (data.length) {
        return res.status(200).send({ status: true, records: data });
      } else {
        return res
          .status(200)
          .send({ status: true, message: res.__("RECORDS_NOT_FOUND...") });
      }
    }
  } catch (error) {
    console.log(error);
    return res.status(400).send({ status: false, message: error.message });
  }
};

const payment = async (req, res) => {
  try {
    if (req.user.Customer_id == null) {
      return res
        .status(200)
        .send({ status: true, message: "please login first" });
    } else {
      let cardDetail = {};
      cardDetail.card = {
        number: req.body.cardnumber,
        exp_month: req.body.exp_month,
        exp_year: req.body.exp_year,
        cvv: req.body.cvv,
      };

      stripe.tokens.create(cardDetail, async (err, token) => {
        if (err) {
          return res
            .status(200)
            .send({ status: 200, message: res.__("ERROR") });
        }
        if (token) {
          let selectRecords = await order.findOne({
            where: { user_id: req.user.id },
          });
          if (selectRecords) {
            let itemPrice = await item.findOne({
              where: { id: selectRecords.item_id },
            });
          } else {
            return res
              .status(200)
              .send({ status: true, message: res.__("RECORDS_NOT_FOUND...")});
          }

          let params = {
            amount: itemPrice * 100,
            currency: "usd",
            description: "my first payment",
            source: token.id,
            customer: token.Customer_id,
          };
          stripe.charges.create(params, async (err, charge) => {
            if (err) {
              console.log(err);
              return res.send(err);
            }
            if (charge.paid == true) {
              await order.update(
                { status: "Dispached" },
                { where: { user_id: req.user.id } }
              );
              return res
                .status(200)
                .send({ status: true, message: res.__("PAYMENT_SUCCESSFUL" )});
            } else {
              return res
              .status(200)
              .send({ status: true, message: res.__("SOMETHING_WENT_WRONG" )});
            }
          });
        } else {
          return res
            .status(200)
            .send({ status: true, message: res.__("SOMETHING_WENT_WRONG" )});
        }
      });
    }
  } catch (error) {
    return res.status(200).send({ status: true, message: error });
  }
};

module.exports = {
  getOrder,
  createOrder,
  getallOrder,
  updateOrderstatus,
  invoiceGenration,
  payment,
};
