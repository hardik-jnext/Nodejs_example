const express = require("express");
const router = express.Router();
const {getUser,allUser,createUser,loginUser,updateUser,deleteUser,roleUser,orderrole,onlyadmin,deleteItem,sendmail,verifyOtp,changepassword,forgetPassword,forgetPasswordmail} = require("../controller/users.controllers.js");
const authUser = require("../middleware/user.auth.js");
const {celebrate} = require("celebrate")
const {usercreatevalid,findUser,updateUservalidation,onlyadminValidation,changepasswordvalid,forgetPasswordvalid} = require("../validator/users.validator.js")


router.route("/all").get(allUser)
router.post("/login", loginUser);
router.route("/alluser").get(authUser, allUser);

router.route("/getUser/:id").get(celebrate(findUser),getUser);
      
//user register api
router.post("/register",celebrate(usercreatevalid),createUser);

        // without auth
//router.put("/update/:id",updateUser)
      //with auth
router.put("/update",celebrate(updateUservalidation),authUser,updateUser)

    // without auth
//router.delete("/delete/:id",deleteUser)
     // without auth
router.delete("/delete",authUser,deleteUser)


router.get("/userRole",authUser,roleUser)

router.get("/orderrole",authUser,orderrole)
  
  //only admin 
router.get("/onlyadmin",celebrate(onlyadminValidation),authUser,onlyadmin)



router.delete('/deleteitem/:id',authUser,deleteItem)

//email

router.get("/gmail",sendmail)

//verify otp
 router.post("/verifyOtp/:otp",verifyOtp)

// change password
router.put("/changepassword",celebrate(changepasswordvalid),authUser,changepassword)


// forgot password
router.get("/forgotpasswordmail/",forgetPasswordmail) 
router.put("/forgotpassword/:otp",celebrate(forgetPasswordvalid),forgetPassword) 
  
module.exports = router;
