const db = require("../config/Config.js");
const user = db.user;
const jwt = require("jsonwebtoken");
const { order, item } = require("../config/Config.js");
const secretkey = "hello";
const { QueryTypes, Op } = require("sequelize");
const nodemailer = require("nodemailer");
const fs = require("fs");
const Handlebars = require("handlebars");
const path = require("path");
const otp = require("../helpers/otpGenretor.helper.js");
const sendMail = require("../helpers/sendMail.helper.js");
const moment = require("moment");

//  Register

// 1. Register User - Insert/Create

const createUser = async (req, res) => {
  try {
    let body = req.body;
    let records = await user.findOne({ where: { email: body.email } });
    if (records && records.id) {
      return res.json({
        message: res.__("Already Registered..."),
      });
    } else {
      let expireDate = moment().add(5, "minutes");

      let data = await user.create({
        userName: body.userName,
        email: body.email,
        age: body.age,
        address: body.address,
        role: body.role,
        status: body.status,
        otp: otp,
        expireOtpTime: expireDate,
      });
      let obj = { userName: data.userName, otp: data.otp };
      await sendMail("dishang.jnext@gmail.com", "hardik.jnext@gmail.com", obj);
      return res.json({ data });
    }
  } catch (e) {
    return res.send("error");
  }
};

//2.Get All registered User - Read

// const allUser = async (req, res) => {
//   let data = await user.findAll();
//   res.json({data});
// };

//3. Get user by Id - Read

const getUser = async (req, res) => {
  let data = await user.findOne({ where: { id: req.params.id } });

  if (data) {
    res.json({ data });
  } else {
    res.json({
      message: res.__("User not found..."),
    });
  }
};

// 4. generate token

const loginUser = async (req, res) => {
  try {
    let body = req.body;
    let findUser = await user.findOne({
      where: { email: body.email },
      raw: true,
    });
    if (!findUser) {
      return res.json({ message: res.__("USER_NOT_REGISTERD!!") });
    }
    if (findUser.status == "InActive") {
      return res.json({
        message: res.__("PLEASE_VERIFY_YOUR_EMAIL_ADRESS!!!"),
      });
    }

    let token = jwt.sign(findUser, secretkey);
    return res.send({ token });
  } catch (error) {
    return res.send(error);
  }
};

//4.1 Get users list (with authentication)

const allUser = async (req, res) => {
  let data = await user.findAll();
  res.json({ data });
};

//5. Update my profile (without using token) - Update/Edit

// const updateUser = async (req, res) => {
//   let [updated] = await user.update(
//     {
//       userName: req.body.userName,
//       email: req.body.email,
//       age: req.body.age,
//       address: req.body.address,
//     },
//     { where: { id: req.params.id } }
//   );
//   if ([!updated[0]]) {
//     res.json({ message: res.__("NOT_UPDATED...") });
//   }
//   let data = await user.findOne({ where: { id: req.params.id } });
//   res.json({data});
// };

//5.1 Update my profile (using token)

const updateUser = async (req, res) => {
  try {
    let records = await user.findOne({ where: { id: req.user.id } });
    if (records.status == "InActive") {
      return res.json({
        message: res.__("PLEASE_VERIFY_YOUR_EMAIL_ADRESS!!!"),
      });
    }

    if (!records) {
      res.json({ message: res.__("RECORDS_NOT_FOUND...") });
    } else {
      let update = await user.update(
        {
          userName: req.body.userName,
          email: req.body.email,
          age: req.body.age,
          address: req.body.address,
          otp: otp,
          expireOtpTime: local,
        },
        { where: { id: records.id } }
      );
      if (update && update[0]) {
        let record = await user.findOne({ where: { id: records.id } });
        res.json({ message: res.__("UPDATED..."), data: record });
      } else {
        res.json({ message: res.__("NOT_UPDATED") });
      }
    }
  } catch (e) {
    res.send(e);
  }
};

//6.Delete my profile (without using token) - Delete

// const deleteUser =async(req,res)=>{
//   let data = await user.destroy({where :{id:req.params.id}})
// res.json({data})

// }

//6.1  Delete my profile ( using token) - Delete

const deleteUser = async (req, res) => {
  let data = await user.destroy({ where: { id: req.user.id } });
  if (data && data[0]) {
    res.json({ message: res.__("ACCOUNT_CAN'T_DELETED") });
  } else {
    res.json({ message: res.__("YOUR_ACCOUNT_WAS_DELETED!!!") });
  }
};

//Task no. 20 If logged in user has role, admin they can get ALL user list, else they can't

const roleUser = async (req, res) => {
  try {
    if (req.user.role == "Admin") {
      const data = await user.findAll();
      res.send(data);
    } else {
      res.json({ message: res.__("YOU_CAN'T_ACCSES") });
    }
  } catch (e) {
    res.json({ message: e });
  }
};

//Task no.21 Modify getAll orders list API

const orderrole = async (req, res) => {
  try {
    if (req.user.role == "Admin") {
      const data = await order.findAll();
      res.send(data);
    } else if (req.user.role == "Customer") {
      const data = await order.findOne({ where: { user_id: req.user.id } });
      res.send(data);
    } else if (req.user.role == "Manufacturer") {
      const data = await order.findAll({
        include: [{ model: item, attributes: ["itemName", "manufature_id"] }],
        where: { user_id: req.user.id },
      });
      if (data && data[0]) {
        res.send(data);
      } else {
        res.json({ message: res.__("ORDER_NOT_FOUND") });
      }
    } else {
      res.json({ message: res.__("ROLE_NOT_FOUND") });
    }
  } catch (error) {}
};

//Task no. 30 && 32 && 34

const onlyadmin = async (req, res) => {
  try {
    if (req.user.role == "Admin") {
      const data = await db.sequelize.query(
        `SELECT Count(DISTINCT orders.user_id) as user FROM users
      JOIN orders on users.id = orders.user_id
      WHERE role = "Customer"
      GROUP by orders.user_id`,
        {
          type: QueryTypes.SELECT,
        }
      );
      if (req.query.start && req.query.end) {
        const user_id = await user.findAll({
          where: {
            createdAt: {
              [Op.between]: [
                new Date(req.query.start),
                new Date(req.query.end),
              ],
            },
            role: "Customer",
          },
        });
        res.json({ ordered: data.length, customer: user_id });
      } else if (req.query.start && !req.query.end) {
        const user_id = await user.findAll({
          where: {
            createdAt: { [Op.gte]: new Date(req.query.start) },
            role: "Customer",
          },
        });
        res.json({ ordered: data.length, customer: user_id });
      } else if (req.query.end && !req.query.start) {
        const user_id = await user.findAll({
          where: {
            createdAt: { [Op.lte]: new Date(req.query.end) },
            role: "Customer",
          },
        });
        res.json({ ordered: data.length, customer: user_id });
      } else {
        res.send("error");
      }
    }
  } catch (e) {
    res.send(e);
  }
};

// Create one Delete Item api which can be accessed by Admin

const deleteItem = async (req, res) => {
  try {
    if (req.user.role == "Admin") {
      const deleteitem = await item.destroy({ where: { id: req.params.id } });

      res.json(deleteitem);
    } else {
      res.json({ mesaage: res.__("YOU_CAN'T_ACCSES") });
    }
  } catch (error) {
    res.send(error);
  }
};

const sendmail = async (req, res) => {
  try {
    let transporter = nodemailer.createTransport({
      host: "smtp.sendgrid.net",
      port: 465,
      secure: true,
      auth: {
        user: "apikey",
        pass: `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`,
      },
    });
    let data = {
      name: "hardik",
      company: "jnext",
    };

    const readfile = fs.readFileSync(
      path.join(__dirname, "../email/gmail.html"),
      "utf-8"
    );
    const handlebarsTemplate = Handlebars.compile(readfile);
    const parsedHtml = handlebarsTemplate(data);

    let message = {
      from: "dishang.jnext@gmail.com",
      to: "hardik.jnext@gmail.com",
      subject: "I am sending a fake mail...",
      html: parsedHtml,
    };
    transporter.sendMail(message, (err, info) => {
      if (err) {
        console.log("Error occurred. " + err);
      }
      console.log("Message sent:", info);
    });
    return res.send("Done...");
  } catch (error) {
    console.log(error);
    return res.json({ message: error });
  }
};

// Add new API with name: /verifyOtp, in this pass otp in params and check with user table otp

const verifyOtp = async (req, res) => {
  try {
    const verifyEmail = await user.findOne({
      where: { email: req.body.email },
    });
    let currentdate = moment().utc();
    if (verifyEmail.expireOtpTime < currentdate) {
      return res.json({ mesaage: res.__("OTP_EXPIRED!!!") });
    } else {
      if (verifyEmail.status == "Active") {
        return res.json({ message: res.__("USER_ALREADY_VERIFIED...") });
      }
      const verifyotp = await user.update(
        { isVerify: true, status: "Active" },
        {
          where: {
            otp: req.params.otp,
          },
        }
      );
      if (!verifyotp[0]) {
        return res.json({ message: res.__("YOUR_OTP_IS_WRONG") });
      } else {
        return res.json({
          mesaage: res.__(`CONGRATULATION_NOW_YOUR_PROFILE_IS_VERIFIED... `),
        });
      }
    }
  } catch (e) {
    return res.json({ message: e });
  }
};

// Task no. 45 (Add change password api, user can change own password.)

const changepassword = async (req, res) => {
  if (req.body.newpassword === req.body.confirmpassword) {
    let oldPassoword = await user.findOne({
      where: {
        password: req.user.password,
      },
    });

    if (oldPassoword.password == req.body.oldpassword) {
      let data = await user.update(
        { password: req.body.newpassword },
        {
          where: {
            id: req.user.id,
          },
        }
      );
      return res.json({ data });
    } else {
      return res.json({ message: res.__("OLD_PASSWORD DOES'T MATCH") });
    }
  } else {
    return res.json({ message: res.__("CONFIRM_PASSWORD_DOES'T_MATCH") });
  }
};

const forgetPasswordmail = async (req, res) => {
  let expireDate = moment().add(5, "minutes");
  const data = await user.update(
    { otp: otp, expireOtpTime: expireDate },
    { where: { email: req.body.email } }
  );
  const find = await user.findOne({ where: { email: req.body.email } });

  let obj = { userName: find.userName, otp: otp };

  await sendMail("dishang.jnext@gmail.com", find.email, obj);
  return res.json({ data });
};

const forgetPassword = async (req, res) => {
  let find = await user.findOne({ where: { email: req.body.email } });
  let currentdate = moment().utc();

  if (find.expireOtpTime > currentdate) {
    if (find.otp == req.params.otp) {
      if (req.body.newpassword === req.body.confimpassword) {
        let data = await user.update(
          { password: req.body.newpassword },
          {
            where: {
              email: req.body.email,
            },
          }
        );
        return res.json({ data });
      } else {
        return res.json({
          message: res.__("PASSOWRD_AND_CONFIRM_PASSWORD_DOES'T_MATCH"),
        });
      }
    } else {
      return res.json({ message: res.__("YOUR_OTP_IS_WRONG") });
    }
  } else {
    return res.json({ message: res.__("YOUR_OTP_IS_EXPIRED!!!") });
  }
};

module.exports = {
  getUser,
  allUser,
  createUser,
  loginUser,
  updateUser,
  deleteUser,
  roleUser,
  orderrole,
  onlyadmin,
  deleteItem,
  sendmail,
  verifyOtp,
  changepassword,
  forgetPassword,
  forgetPasswordmail,
};
