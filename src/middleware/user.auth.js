const jwt = require("jsonwebtoken");
let secretkey = "hello";
let db = require("../config/Config.js");
let user = db.user;

const authUser = async(req, res, next) => {
  try {
    const bearerHeader = req.header("Authorization");
    const bearer = bearerHeader.split(" ");
    const token = bearer[1];
    let decode = jwt.verify(token, secretkey);
    let userData = await user.findOne({ where: { id: decode.id } });
    if (!userData) {
      res.status(200).send({status : true,message: res.__("INVALID_TOKEN"), });
    } 
      req.user = JSON.parse(JSON.stringify(userData));
    next();
  } catch (error) {
    res.status(200).send({status : true, message : res.__("TOKEN_NOT_FOUND")});
  }
};
module.exports = authUser;
