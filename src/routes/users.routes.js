const express = require("express");
const router = express.Router();
const {
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
  deleteItem,
  sendmail,
  verifyOtp,
  changepassword,
  forgetPassword,
  forgetPasswordmail,
} = require("../controller/users.controllers.js");
const authUser = require("../middleware/user.auth.js");
const { celebrate } = require("celebrate");
const {
  usercreatevalid,
  findUser,
  updateUservalidation,
  onlyadminValidation,
  changepasswordvalid,
  forgetPasswordvalid,
} = require("../validator/users.validator.js");




/**
 *@swagger
 * componenets :
 *  schemas:
 *    user:
 *        type: object
 *        properties:
 *         id:
 *            type: integer
 *         userName: 
 *            type: string
 *         email:
 *            type: string
 *         age :
 *            type: integer 
 *         address:
 *            type: string
 *         role:
 *            type: string
 *         status:
 *            type: string
 *         isVerify:
 *            type: boolean
 *         otp:
 *            type: integer
 *         expireOtpTime:
 *            type: string
 *            format: date
 *         password:
 *            type: string
 *  
 *
 * 
 */         

//get all register user

/**
 * @swagger
 * /all-registerUser:
 *     get:
 *       summary: get all users
 *       responses:
 *          200:
 *            description : list of register user
 *            content:
 *              application/json:
 *                schema:
 *                   type: array
 *      
 */             
router.route("/all-registerUser").get(getAllRegister);

// get all user with auth
/**
 * @swagger
 * /alluser-withAuth:
 *     get:
 *       summary: get all users
 *       responses:
 *          200:
 *            description : list of register user
 *            content:
 *              application/json:
 *                schema:
 *                   type: array
 *      
 */             

router.route("/alluser-withAuth").get(authUser, allUser);

/**
 * @swagger
 * /login:
 *     post:
 *       summary: get all users
 *       consumes:
*          - json/plain  
 *       parameters:
*        - in: body
*          email: user
*          description: Find Token
*          schema:
*            type: object
*            required:
*              - email
*
 *       responses:
 *          200:
 *            description : list of register user
 *            content:
 *              application/json:
 *                schema:
 *                   type: array
 *      
 */             

router.post("/login", loginUser);

router.route("/getUser/:id").get(celebrate(findUser), getUser);

//user register api
router.post("/register", celebrate(usercreatevalid), createUser);

// without auth
router.put("/update-User-WithoutAuth/:id", updateUserWithoutAuth);
//with auth
router.put(
  "/update-User-WithAuth",
  celebrate(updateUservalidation),
  authUser,
  updateUser
);

// without auth
router.delete("/delete-without-auth/:id", deleteUserWithoutAuth);
// without auth
router.delete("/delete-with-auth", authUser, deleteUserWithAuth);

router.get("/userRole", authUser, roleUser);

router.get("/orderrole", authUser, orderrole);

//only admin
router.get("/onlyadmin", celebrate(onlyadminValidation), authUser, onlyadmin);

router.delete("/deleteitem/:id", authUser, deleteItem);

//email
router.get("/gmail", sendmail);

//verify otp
router.post("/verifyOtp/:otp", verifyOtp);

// change password
router.put(
  "/changepassword",
  celebrate(changepasswordvalid),
  authUser,
  changepassword
);

// forgot password
router.get("/forgotpasswordmail/", forgetPasswordmail);
router.put(
  "/forgotpassword/:otp",
  celebrate(forgetPasswordvalid),
  forgetPassword
);

module.exports = router;
