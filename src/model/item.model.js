const {DataTypes} = require('sequelize')


module.exports = (sequelize,Sequelize)=>{
 let item = sequelize.define("item",{
     itemName :{
        type : DataTypes.STRING,
        allowNull : false,     
     },
     price :{
        type : DataTypes.INTEGER,
        allowNull: false,
     },
     manufature_id :{
       type : DataTypes.INTEGER
     },
     expiryDate :{
      type : DataTypes.DATE
     },item_image :{
      type : DataTypes.STRING
     }
    
 }) 
 return item
}