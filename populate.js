const Product = require("./models/product");

const jsonProducts = require("./products.json");

console.log(jsonProducts);

const start = async () => {
  try {
    await Product.bulkCreate(jsonProducts);
    process.exit(0);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

start();
