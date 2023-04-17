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
  loginvalid
} = require("../validator/users.validator.js");
const { payment } = require("../controller/order.controllers.js");




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
 */         

//get all register user

/**
 * @swagger
 * /all-registerUser:
 *     get:
 *       tags:
 *         - User
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
 *       tags:
 *        - User
 *       security:
 *         - bearerAuth: []
 *       summary: get all users with authentication
 *       responses:
 *          200:
 *            description : list of register user
 *            content:
 *              application/json:
 *                schema:
 *                   type: array   
 */             
router.route("/alluser-withAuth").get(authUser, allUser);

/**
* @swagger
* /login:
*     post:
*       tags:
*         - User
*       summary: User login
*       description: User login
*       requestBody:
*           required: true
*           content:
*             application/json:
*               schema:
*                 type: object
*                 properties:
*                     email: 
*                       type: string 
*                     password:
*                        type: string 
*       responses:
*          200:
*            description : list of register user
*            content:
*              application/json:
*                schema:
*                   type: array
*      
*/             

router.post("/login",celebrate(loginvalid),loginUser);

     // get user by id
  
/**
 * @swagger
 * /getUser/{id}:
 *   get:
 *     tags:
 *      - User
 *     summary: Get a user by ID
 *     description: Retrieve a user from the database by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Numeric ID of the user to retrieve
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: OK
 *       404:
 *         description: User not found
 */     

router.route("/getUser/:id").get(celebrate(findUser), getUser);

       //user register api

/**
* @swagger
* /register:
*     post:
*       tags:
*         - User
*       summary: User Registration
*       description: User Registration
*       requestBody:
*           required: true
*           content:
*             application/json:
*               schema:
*                 type: object
*                 properties:
*                     userName:
*                       type: string
*                     email: 
*                       type: string 
*                     age:
*                      type: integer
*                     address:
*                      type: string
*                     role:
*                      type: string
*                     password:
*                      type: string               
*       responses:
*          200:
*            description : list of register user
*            content:
*              application/json:
*                schema:
*                   type: array
*      
*/             

router.post("/register", celebrate(usercreatevalid), createUser);

       // without auth update

/**
* @swagger
* /update-User-WithoutAuth/{id}:
*     put:
*      tags:
*        - User
*      summary: User Update with out authentication
*      description: User Update with out authentication
*      parameters:
*       - in: path
*         name: id
*         required: true
*         description: Numeric ID of the user to update
*         schema:
*           type: integer
*      requestBody:
*          required: true
*          content:
*             application/json:
*               schema:
*                 type: object
*                 properties:
*                     userName:
*                       type: string
*                     email: 
*                       type: string 
*                     age:
*                      type: integer
*                     address:
*                      type: string
*      responses:
*          200:
*            description : update user
*            content:
*              application/json:
*                schema:
*                   type: array
*      
*/ 

router.put("/update-User-WithoutAuth/:id", updateUserWithoutAuth);

//with auth

/**
* @swagger
* /update-User-WithAuth:
*     put:
*      tags:
*        - User
*      security:
*         - bearerAuth: []
*      summary: User Update with  authentication
*      description: User Update with  authentication    
*      requestBody:
*          required: true
*          content:
*             application/json:
*               schema:
*                 type: object
*                 properties:
*                     userName:
*                       type: string
*                     email: 
*                       type: string 
*                     age:
*                      type: integer
*                     address:
*                      type: string
*      responses:
*          200:
*            description : update user
*            content:
*              application/json:
*                schema:
*                   type: array
*      
*/ 
router.put( "/update-User-WithAuth", celebrate(updateUservalidation),authUser,updateUser);


       // without auth

/**
* @swagger
* /delete-without-auth/{id}:
*     delete:
*      tags:
*        - User
*      summary: User delete with out authentication
*      description: User delete with out authentication
*      parameters:
*       - in: path
*         name: id
*         required: true
*         description: Numeric ID of the user to delete
*         schema:
*           type: integer
*      responses:
*          200:
*            description : delete user
*            content:
*              application/json:
*                schema:
*                   type: array
*      
*/ 
router.delete("/delete-without-auth/:id", deleteUserWithoutAuth);

        // with auth

/**
* @swagger
* /delete-with-auth:
*     delete:
*      tags:
*        - User
*      security:
*         - bearerAuth: []
*      summary: User Update with  authentication
*      description: User Update with  authentication    
*      responses:
*          200:
*            description : delete user
*            content:
*              application/json:
*                schema:
*                   type: array
*      
*/ 

router.delete("/delete-with-auth", authUser, deleteUserWithAuth);


/**
* @swagger
* /userRole:
*     get:
*      tags:
*        - User
*      security:
*         - bearerAuth: []
*      summary: only admin access
*      description: only admin access 
*      responses:
*          200:
*            description : only admin access
*            content:
*              application/json:
*                schema:
*                   type: array
*      
*/ 
    

router.get("/userRole", authUser, roleUser);

     //order role

/**
* @swagger
* /orderrole:
*     get:
*      tags:
*        - User
*      security:
*         - bearerAuth: []
*      summary: order role
*      description: if role is admin show all orders, if role is customer show their order if  role manufacturer show order item
*      responses:
*          200:
*            description : if role is admin show all orders
*            content:
*              application/json:
*                schema:
*                   type: array
*      
*/ 
    

router.get("/orderrole", authUser, orderrole);


/**
* @swagger
* /onlyadmin:
*     get:
*      tags:
*        - User
*      security:
*         - bearerAuth: []
*      summary: only admin show 
*      description: This API is  for only Admin can access, to get how many users are registered in system. and Add filter to get how many users register between two dates, in same api mentioned in 30 point and Without range if only from date is given find records from that date till current date and same for toDate find orders before toDate
*      parameters:
*       - in: query
*         name: start
*         schema:
*           type: string
*         description: Give start date
*       - in: query
*         name: end
*         schema:
*           type: string
*         description: Give end date
*      responses:
*          200:
*            description : only admin show
*            content:
*              application/json:
*                schema:
*                   type: array
*      
*/ 

router.get("/onlyadmin", celebrate(onlyadminValidation), authUser, onlyadmin);


//email
router.get("/gmail", sendmail);


 
      //verify otp

/**
 * @swagger
 * /verifyOtp/{otp}:
 *   post:
 *     tags:
 *      - User
 *     summary: verify user
 *     description: verify user using otp
 *     parameters:
 *       - in: path
 *         name: otp
 *         required: true
 *         description: verify user using otp
 *         schema:
 *           type: integer
 *     requestBody:
*          required: true
*          content:
*             application/json:
*               schema:
*                 type: object
*                 properties:
*                     email:
*                       type: string  
*     responses:
*       200:
*         description: OK
*       404:
*         description: User not found
*/   

router.post("/verifyOtp/:otp", verifyOtp);


           // change password

/**
* @swagger
* /changepassword:
*     put:
*      tags:
*        - User
*      security:
*        - bearerAuth: []
*      summary:  change user password
*      description: change user password
*      requestBody:
*          required: true
*          content:
*             application/json:
*               schema:
*                 type: object
*                 properties:
*                     oldpassword:
*                       type: string
*                     newpassword: 
*                       type: string 
*                     confirmpassword:
*                       type: string
*      responses:
*          200:
*            description : change user password
*            content:
*              application/json:
*                schema:
*                   type: array
*      
*/ 

router.put("/changepassword",celebrate(changepasswordvalid),authUser, changepassword);


// forgot password

/**
* @swagger
* /forgotpasswordmail:
*     post:
*       tags:
*         - User
*       summary: forgot password mail
*       description: forgot password mail for user
*       requestBody:
*           required: true
*           content:
*             application/json:
*               schema:
*                 type: object
*                 properties:
*                     email: 
*                       type: string           
*       responses:
*          200:
*            description : forgot password mail for user
*            content:
*              application/json:
*                schema:
*                   type: array
*      
*/   


router.post("/forgotpasswordmail/", forgetPasswordmail);

       // verify forgot password mail

/**
 * @swagger
 * /forgotpassword/{otp}:
 *    put:
 *     tags:
 *      - User
 *     summary: verify user
 *     description: verify user using otp
 *     parameters:
 *       - in: path
 *         name: otp
 *         required: true
 *         description: verify user using otp
 *         schema:
 *           type: integer
 *     requestBody:
*          required: true
*          content:
*             application/json:
*               schema:
*                 type: object
*                 properties:
*                     email:
*                       type: string  
*                     newpassword: 
*                       type: string 
*                     confirmpassword:
*                       type: string
*     responses:
*       200:
*         description: OK
*       404:
*         description: User not found
*/ 

router.put("/forgotpassword/:otp",celebrate(forgetPasswordvalid),forgetPassword);



module.exports = router;
