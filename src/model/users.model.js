const {DataTypes} = require('sequelize')


module.exports = (sequelize,Sequelize)=>{
   
    const user = sequelize.define("user",{

       userName :{
        type : DataTypes.STRING,
        allowNull: false
       },
       email :{
        type : DataTypes.STRING,
        allowNull : false
       },
       age :{
        type : DataTypes.INTEGER,
        allowNull : false
       },
       address :{
        type : DataTypes.STRING,
        allowNull: false
       },
       role :{
        type : DataTypes.ENUM("Customer","Admin","Manufacturer")
       },
       status :{
         type : DataTypes.ENUM("Active","InActive"),
         defaultValue : "InActive"
       },
       isVerify :{
         type : DataTypes.BOOLEAN,
         defaultValue : "false"
       },otp :{
        type : DataTypes.INTEGER
       },
       expireOtpTime :{
        type : DataTypes.DATE
       },
       password :{
        type : DataTypes.CHAR
       }
    
    
    })
 return user

}