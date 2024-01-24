const { Op } = require("sequelize");
const Product = require("../models/product");

const getAllProductsStatic = async (req, res) => {
  const products = await Product.findAll({
    where: {
      price: { [Op.gt]: 30 },
    },
    order: [["price", "ASC"]],
    attributes: ["name", "price"],
  });
  res.status(200).json({ products, nbHits: products.length });
};

const getAllProducts = async (req, res) => {
  const { featured, company, name, sort, fields, numericFilters } = req.query;
  const queryObject = {};
  if (featured) {
    queryObject.featured = featured === "true" ? true : false;
  }

  if (company) {
    queryObject.company = company;
  }

  if (name) {
    queryObject.name = { [Op.regexp]: name };
  }

  if (numericFilters) {
    const operatorMap = {
      ">": "gt",
      ">=": "gte",
      "=": "Op.eq",
      "<": "Op.lt",
      "<=": "Op.lte",
    };
    const regEx = /\b(>|>=|=|<|<=)\b/g;
    let filters = numericFilters.replace(regEx, (match) => `-${operatorMap[match]}-`);
    const options = ["price", "rating"];
    filters = filters.split(",").forEach((item) => {
      const [field, operator, value] = item.split("-");
      if (options.includes(field)) {
        queryObject[field] = { [Op[operator]]: Number(value) };
      }
    });
  }

  console.log(queryObject);

  // Sort
  const sortColumns = sort ? sort.split(",") : [];
  const orderCriteria = sortColumns.map((col) => {
    const sortOrder = col.charAt(0) !== "-" ? "ASC" : "DESC";
    const columnName = sortOrder === "DESC" ? col.slice(1) : col;
    return [columnName, sortOrder];
  });

  // Fields
  const fieldsColumns = fields ? fields.split(",") : [];

  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const result = Product.findAll({
    where: queryObject,
    order: sort ? orderCriteria : [["createdAt", "ASC"]],
    attributes: fields ? fieldsColumns : undefined,
    offset: skip,
    limit: limit,
  });

  const products = await result;
  res.status(200).json({ products, nbHits: products.length });
};

module.exports = {
  getAllProducts,
  getAllProductsStatic,
};
