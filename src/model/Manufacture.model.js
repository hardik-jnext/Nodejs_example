const {DataTypes} = require('sequelize')


module.exports = (sequelize,Sequelize)=>{
 let manufacture = sequelize.define("manufacture",{
    manufacturer :{
        type : DataTypes.STRING,
        allowNull : false,     
     },
     adress :{
        type : DataTypes.STRING,
        allowNull: false,
     },
     country:{
         type : DataTypes.STRING,
         allowNull:false
     },
     city:{
        type : DataTypes.STRING,
        allowNull:false
    },

 }) 
 return manufacture
}