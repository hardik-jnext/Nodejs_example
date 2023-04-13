const db = require("../config/Config.js");
const user = db.user;
const jwt = require("jsonwebtoken");
const { order, item } = require("../config/Config.js");
const secretkey = "hello";
const { QueryTypes, Op, DATE } = require("sequelize");
const nodemailer = require("nodemailer");
const fs = require("fs");
const Handlebars = require("handlebars");
const path = require("path");
const otp = require("../helpers/otpGenretor.helper.js");
const sendMail = require("../helpers/sendMail.helper.js");
const moment = require("moment");

// 4.1 (Register User - Insert/Create)
// Task no.39 (Create common function with otp generation, add field for OTP in user table, also add field for expireOtpTime)
//Task no.40 (Implement sendEmail for register API.)
//Task no.43(Set OTP expiration time of currentTime + 5 minute, also add check for expiration time.)

const createUser = async (req, res) => {
  try {
    let body = req.body;
    let records = await user.findOne({ where: { email: body.email } });
    if (records && records.id) {
      return res
        .status(200)
        .send({ status: true, message: res.__("ALREADY_REGISTERED...") });
    } else {
      let expireDate = moment().add(5, "minutes");
      let data = await user.create({
        userName: body.userName,
        email: body.email,
        age: body.age,
        address: body.address,
        role: body.role,
        otp: otp,
        expireOtpTime: expireDate,
        password: body.password
      });
      let obj = { userName: data.userName, otp: data.otp };
      await sendMail("dishang.jnext@gmail.com", data.email, obj);
      return res.status(200).send({ status: true, records: data });
    }
  } catch (e) {
    console.log(error);
    return res.status(400).send({ status: false, message: error.message });
  }
};

//4.2(Get All registered User - Read)

const getAllRegister = async (req, res) => {
  try {
    let data = await user.findAll();
    if (data.length) {
      return res.status(200).send({ status: true, records: data });
    } else {
      return res
        .status(200)
        .send({ status: true, Error: res.__("RECORDS_NOT_FOUND...") });
    }
  } catch (error) {
    console.log(error);
    return res.status(400).send({ status: false, message: error.message });
  }
};

//4.3 (Get user by Id - Read)

const getUser = async (req, res) => {
  try {
    let data = await user.findOne({ where: { id: req.params.id } });
    if (data) {
      return res.status(200).send({ status: true, records: data });
    } else {
      return res
        .status(200)
        .send({ status: true, message: res.__("USER_NOT_FOUND") });
    }
  } catch (error) {
    console.log(error);
    return res.status(400).send({ status: false, message: error.message });
  }
};

// 4.4 Get users list (with authentication) - Read
//Task no.38 (Add restriction in login API that only active users can login, and create item/order.)
//Task no.40 (Add check in login if user is verified then and then it can login)

const loginUser = async (req, res) => {
  try {
    let body = req.body;
    let findUser = await user.findOne({
      where: { email: body.email },
      raw: true,
    });
    if (!findUser) {
      return res
        .status(200)
        .send({ status: true, message: res.__("USER_NOT_REGISTERD!!") });
    }
    if(findUser.password != body.password){
          return res.status(200).send({status : true,message : res.__("INVALID_PASSWORD")})
    }
    if (findUser.status == "InActive") {
      return res
        .status(200)
        .send({
          status: true,
          message: res.__("PLEASE_VERIFY_YOUR_EMAIL_ADRESS!!!"),
        });
    }
    let token = jwt.sign(findUser, secretkey);
    return res.send({ token });
  } catch (error) {
    console.log(error);
    return res.status(400).send({ status: false, message: error.message });
  }
};

//4.4 Get users list (with authentication)

const allUser = async (req, res) => {
  try {
    let data = await user.findAll();
    if (!data) {
      return res
        .status(200)
        .send({ status: true, message: res.__("RECORDS_NOT_FOUND...") });
    } else {
      return res.status(200).send({ status: true, users: data });
    }
  } catch (error) {
    console.log(error);
    return res.status(400).send({ status: false, err: error });
  }
};

//4.5 (Update my profile (without using token) - Update/Edit0

const updateUserWithoutAuth = async (req, res) => {
  try {
    let updated= await user.update(
      {
        userName: req.body.userName,
        email: req.body.email,
        age: req.body.age,
        address: req.body.address,
      },
      { where: { id: req.params.id } }
    );
    if (!updated[0]) {
      return res
        .status(200)
        .send({ status: true, message: res.__("NOT_UPDATED...") });
    }
    let data = await user.findOne({ where: { id: req.params.id } });
    return res.status(200).send({ status: true,message : res.__("UPDATED"),records: data });
  } catch (error) {
    console.log(error);
    return res.status(400).send({ status: false, message: error.message });
  }
};

//4.6 (Update my profile (using token))

const updateUser = async (req, res) => {
  try {
    let expireDate = moment().add(5, "minutes");
    let records = await user.findOne({ where: { id: req.user.id } });
    if (records.status == "InActive") {
      return res
        .status(200)
        .send({
          status: true,
          message: res.__("PLEASE_VERIFY_YOUR_EMAIL_ADRESS!!!"),
        });
    }
    if (!records) {
      return res.json({ message: res.__("RECORDS_NOT_FOUND...") });
    } else {
      let update = await user.update(
        {
          userName: req.body.userName,
          email: req.body.email,
          age: req.body.age,
          address: req.body.address,
          otp: otp,
          expireOtpTime: expireDate,
        },
        { where: { id: records.id } }
      );
      if (update && update[0]) {
        let record = await user.findOne({ where: { id: records.id } });
        return res
          .status(200)
          .send({ status: true, message: res.__("UPDATED..."), data: record });
      } else {
        return res
          .status(200)
          .send({ status: true, message: res.__("NOT_UPDATED") });
      }
    }
  } catch (error) {
    console.log(error);
    return res.status(400).send({ status: false, message: error.message });
  }
};

//4.7  (Delete my profile ( using token) - Delete)

const deleteUserWithAuth = async (req, res) => {
  try {
    let data = await user.destroy({ where: { id: req.user.id } });
    if (data && data[0]) {
      return res.json({ message: res.__("ACCOUNT_CAN'T_DELETED") });
    } else {
      return res
        .status(200)
        .send({ status: true, message: res.__("YOUR_ACCOUNT_WAS_DELETED!!!") });
    }
  } catch (error) {
    console.log(error);
    return res.status(400).send({ status: false, message: error.message });
  }
};

//4.8  (Delete my profile (without using token) - Delete)

const deleteUserWithoutAuth = async (req, res) => {
  try {
    let data = await user.destroy({ where: { id: req.params.id } });
    if (!data) {
      return res
        .status(200)
        .send({ status: 200, error: res.__("ACCOUNT_ALREADY_DELETED!!!") });
    } else {
      return res
        .status(200)
        .send({ status: true, message: res.__("YOUR_ACCOUNT_WAS_DELETED!!!") });
    }
  } catch (error) {
    console.log(error);
    return res.status(400).send({ status: false, message: error.message });
  }
};

//Task no. 20 If logged in user has role, admin they can get ALL user list, else they can't

const roleUser = async (req, res) => {
  try {
    if (req.user.role == "Admin") {
      const data = await user.findAll();
      if (data.length) {
        return res.status(200).send({ status: true, records: data });
      } else {
        return res
          .status(200)
          .send({ status: true, message: "RECORDS_NOT_FOUND" });
      }
    } else {
      return res.status(200).send({
        status: true,
        error: res.__("YOU_CAN'T_ACCSES"),
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(400).send({ status: false, message: error.message });
  }
};

//Task no.21 Modify getAll orders list API

const orderrole = async (req, res) => {
  try {
    if (req.user.role == "Admin") {
      const data = await order.findAll();
      if (data.length) {
        return res.status(200).send({ status: true, records: data });
      } else {
        return res
          .status(200)
          .send({ status: true, message: res.__("RECORDS_NOT_FOUND...") });
      }
    } else if (req.user.role == "Customer") {
      const data = await order.findOne({ where: { user_id: req.user.id } });
      return res.status(200).send({ status: true, records: data });
    } else if (req.user.role == "Manufacturer") {
      const data = await order.findAll({
        include: [{ model: item, attributes: ["itemName", "manufature_id"] }],
        where: { user_id: req.user.id },
      });
      if (data && data[0]) {
        return res.status(200).send({ status: true, message: data });
      } else {
        return res
          .status(200)
          .send({ status: true, error: res.__("ORDER_NOT_FOUND") });
      }
    } else {
      return res
        .status(200)
        .send({ status: true, error: res.__("ROLE_NOT_FOUND") });
    }
  } catch (error) {
    console.log(error);
    return res.status(400).send({ status: false, message: error.message });
  }
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
        return res
          .status(200)
          .send({ status: true, ordered: data.length, customer: user_id });
      } else {
        return res
          .status(200)
          .send({ status: true, error: res.__("RECORDS_NOT_FOUND...") });
      }
    }
  } catch (error) {
    console.log(error);
    return res.status(400).send({ status: false, message: error.message });
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
    return res.status(200).send({ status: true, message: res.__("MAIL_SEND_SUCCESSFULLY...") });
  } catch (error) {
    console.log(error);
    return res.status(400).send({ status: false, message: error.message });
  }
};

//Task no.41 Add new API with name: /verifyOtp, in this pass otp in params and check with user table otp

const verifyOtp = async (req, res) => {
  try {
    const verifyEmail = await user.findOne({
      where: { email: req.body.email },
    });
     if(verifyEmail.otp != req.params.otp){
       return res.status(200).send({status:true,message : res.__("INVALID_OTP")})
     }
    let currentdate = moment().utc();
    if (verifyEmail.expireOtpTime < currentdate) {
      return res
        .status(200)
        .send({ status: true, error: res.__("OTP_EXPIRED!!!") });
    } else {
      if (verifyEmail.status == "Active") {
        return res
          .status(200)
          .send({ status: true, message: res.__("USER_ALREADY_VERIFIED...") });
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
        return res
          .status(200)
          .send({ status: true, message: res.__("YOUR_OTP_IS_WRONG") });
      } else {
        return res
          .status(200)
          .send({
            status: true,
            mesaage: res.__(`CONGRATULATION_NOW_YOUR_PROFILE_IS_VERIFIED... `),
          });
      }
    }
  } catch (error) {
    console.log(error);
    return res.status(400).send({ status: false, message: error.message });
  }
};

// Task no. 45 (Add change password api, user can change own password.)

const changepassword = async (req, res) => {
  try {
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
        return res
          .status(200)
          .send({ status: true, message: res.__("OLD_PASSWORD DOES'T MATCH") });
      }
    } else {
      return res
        .status(200)
        .send({
          status: true,
          message: res.__("CONFIRM_PASSWORD_DOES'T_MATCH"),
        });
    }
  } catch (error) {
    console.log(error);
    return res.status(400).send({ status: false, message: error.message });
  }
};

//Task no.48 (Check flow with references that how forgot and reset password works.)

const forgetPasswordmail = async (req, res) => {
  try {
    let expireDate = moment().add(5, "minutes");
    const data = await user.update(
      { otp: otp, expireOtpTime: expireDate },
      { where: { email: req.body.email } }
      );
      const find = await user.findOne({ where: { email: req.body.email } });
      console.log(find.userName);
    if(!find){
      return res.status(200).send({status : true,message : res.__("RECORDS_NOT_FOUND...")})
    }else{
      let obj = { userName: find.userName, otp: otp };
      await sendMail("dishang.jnext@gmail.com", find.email, obj);
      return res.status(200).send({ status: true, records: data , message : res.__("MAIL_SENT...") });
    }
  } catch (error) {
    console.log(error);
    return res.status(400).send({ status: false, message: error.message });
  }
};


const forgetPassword = async (req, res) => {
  try {
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
          return res.status(200).send({ status: true, records: data });
        } else {
          return res
            .status(200)
            .send({
              status: true,
              message: res.__("PASSOWRD_AND_CONFIRM_PASSWORD_DOES'T_MATCH"),
            });
        }
      } else {
        return res
          .status(200)
          .send({ status: true, message: res.__("YOUR_OTP_IS_WRONG") });
      }
    } else {
      return res
        .status(200)
        .send({ status: true, message: res.__("YOUR_OTP_IS_EXPIRED!!!") });
    }
  } catch (error) {
    console.log(error);
    return res.status(400).send({ status: false, message: error.message });
  }
};

module.exports = {
  getUser,
  allUser,
  getAllRegister,
  createUser,
  loginUser,
  updateUserWithoutAuth,
  updateUser,
  deleteUserWithoutAuth,
  deleteUserWithAuth,
  roleUser,
  orderrole,
  onlyadmin,
  sendmail,
  verifyOtp,
  changepassword,
  forgetPassword,
  forgetPasswordmail,
};
