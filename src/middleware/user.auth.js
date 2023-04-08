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
      res.json({
        message: "Invalid token",
      });
    } 
      req.user = JSON.parse(JSON.stringify(userData));
    next();
  } catch (error) {
    res.send("Token not found");
  }
};
module.exports = authUser;
