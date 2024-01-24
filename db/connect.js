const { Sequelize } = require("sequelize");

const db = new Sequelize("store_api", "root", "", {
  host: "localhost",
  dialect: "mysql",
});

module.exports = db;
