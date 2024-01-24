const { DataTypes } = require("sequelize");
const db = require("../db/connect");

const Product = db.define(
  "products",
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "nama tidak boleh kosong",
        },
      },
    },
    price: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "harga tidak boleh kosong",
        },
      },
    },
    featured: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    rating: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 4.5,
    },
    company: {
      type: DataTypes.ENUM("ikea", "liddy", "caressa", "marcos"),
      allowNull: false,
      validate: {
        args: [["ikea", "liddy", "caressa", "marcos"]],
        msg: "company tidak ada",
      },
    },
  },
  {
    freezeTableName: true,
  }
);

module.exports = Product;

// (async () => {
//   await db.sync();
// })();
