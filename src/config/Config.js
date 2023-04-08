const Sequelize = require("sequelize");
const sequelize = new Sequelize("nodeMysql_db", "root", "", {
  host: "localhost",
  dialect: "mysql",
  logging :false
});

db = {};
db.sequelize = sequelize;
db.Sequelize = Sequelize;

db.user = require("../model/users.model.js")(sequelize, Sequelize);
db.item = require("../model/item.model")(sequelize, Sequelize);
db.order = require("../model/order.model")(sequelize, Sequelize);
db.manufacture = require("../model/Manufacture.model")(sequelize, Sequelize);

//----------one to one -----------//
db.user.hasOne(db.order, { foreignKey: `user_id` });
db.order.belongsTo(db.user, { foreignKey: `user_id` });

//----------one to one -----------//
db.item.hasOne(db.order, { foreignKey: `item_id` });
db.order.belongsTo(db.item, { foreignKey: `item_id` });

//----------one to one -----------//
db.manufacture.hasOne(db.item, { foreignKey: `manufature_id` });
db.item.belongsTo(db.manufacture, { foreignKey: `manufature_id` });

//----------one to one -----------//
db.user.hasOne(db.manufacture, { foreignKey: `user_id` });
db.manufacture.belongsTo(db.user, { foreignKey: `user_id` });



try {
  sequelize.authenticate();
  console.log("Database Connected...");
} catch (e) {
  console.log(e);
}

module.exports = db;
