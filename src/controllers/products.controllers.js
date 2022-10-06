const { Category } = require("../models/Category.model");
const { Product } = require("../models/Product.model");
const { ProductImgs } = require("../models/ProductImgs.model");
const { User } = require("../models/User.model");
const { AppError } = require("../utils/appError.util");
const { catchAsync } = require("../utils/catchAsync.util");
const {
  uploadProductImgs,
  getProductImgsUrls,
} = require("../utils/firebase.util");

const getActiveProductsController = catchAsync(async (req, res, next) => {
  const products = await Product.findAll({
    where: {
      status: "active",
    },
    include: [
      { model: Category, attributes: ["name"] },
      { model: User, attributes: ["name", "email"] },
      { model: ProductImgs },
    ],
  });
  if (!products) {
    return next(new AppError("Products not found", 404));
  }
  const productsWithImgs = await getProductImgsUrls(products);
  res.status(200).json({
    status: "success",
    data: { productsWithImgs },
  });
});

const getActiveProductByIdController = catchAsync(async (req, res, next) => {
  const { product } = req;
  res.status(200).json({
    status: "success",
    data: { product },
  });
});

const createProductController = catchAsync(async (req, res, next) => {
  const { sessionUser } = req;
  const { title, description, price, categoryId, quantity } = req.body;
  const newProduct = await Product.create({
    title,
    description,
    price,
    quantity,
    categoryId,
    userId: sessionUser.id,
  });
  await uploadProductImgs(req.files, newProduct.id);
  res.status(200).json({
    status: "success",
    data: { newProduct },
  });
});

const updateProductDataController = catchAsync(async (req, res, next) => {
  const { product } = req;
  const { title, description, quantity, price } = req.body;

  await product.update({
    title,
    description,
    quantity,
    price,
  });

  res.status(200).json({
    status: "success",
    data: { product },
  });
});

const softDeleteProductController = catchAsync(async (req, res, next) => {
  const { product } = req;
  await product.update({
    status: "removed",
  });
  res.status(200).json({
    status: "success",
    data: { product },
  });
});

module.exports = {
  getActiveProductsController,
  getActiveProductByIdController,
  createProductController,
  updateProductDataController,
  softDeleteProductController,
};
