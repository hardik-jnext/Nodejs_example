const {DataTypes} = require('sequelize')





module.exports = (sequelize,Sequelize)=>{
 let order = sequelize.define("order",{
     user_id :{
      type :Sequelize.INTEGER
   },
   item_id :{
      type : Sequelize.INTEGER
   },
   status :{
      type : Sequelize.ENUM("Delivered", "Dispached", "Canceled", "Pending"),
      defaultValue: "Pending",
   },
   order_no :{
      type : Sequelize.CHAR
   }
 })
 return order
}