const { hash, compare } = require("bcrypt");
const { User } = require("../models/User.model");
const { AppError } = require("../utils/appError.util");
const { catchAsync } = require("../utils/catchAsync.util");
const { sign } = require("jsonwebtoken");
const { Product } = require("../models/Product.model");
const { Order } = require("../models/Order.model");
const { Cart } = require("../models/Cart.model");
const { ProductsInCart } = require("../models/ProductsInCart.model");

const createNewUserController = catchAsync(async (req, res, next) => {
  const { name, email, password } = req.body;
  const hashedPassword = await hash(password, 12);
  const newUser = await User.create({
    name,
    email,
    password: hashedPassword,
  });
  if (!newUser) {
    return next(new AppError("Something is wrong", 404));
  }
  newUser.password = undefined;
  res.status(201).json({
    status: "success",
    data: { newUser },
  });
});

const loginUserController = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  const user = await User.findOne({ where: { email, status: "active" } });
  if (!user || !(await compare(password, user.password))) {
    return next(new AppError("Wrong credentials", 400));
  }
  user.password = undefined;
  const token = sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });

  res.status(200).json({
    status: "success",
    data: { user, token },
  });
});

const getProductsByUserController = catchAsync(async (req, res, next) => {
  const { sessionUser } = req;
  const products = await Product.findAll({
    where: {
      userId: sessionUser.id,
    },
  });
  if (!products) {
    return next(new AppError("Your dont have any product owner", 404));
  }
  res.status(200).json({
    status: "success",
    data: { products },
  });
});

const updateUserCredentialsController = catchAsync(async (req, res, next) => {
  const { user } = req;
  const { email, name } = req.body;

  await user.update({
    email,
    name,
  });

  res.status(200).json({
    status: "success",
    data: { user },
  });
});

const softDeleteUserController = catchAsync(async (req, res, next) => {
  const { user } = req;
  await user.update({ status: "deleted" });
  res.status(204).json({
    status: "success",
  });
});

const getOrdersController = catchAsync(async (req, res, next) => {
  const { sessionUser } = req;
  const orders = await Order.findAll({
    attributes: ["id", "totalPrice", "status"],
    where: { id: sessionUser.id },
    include: {
      model: Cart,
      include: {
        model: ProductsInCart,
        where: {
          status: "purchased",
        },
        // attributes:{exclude: []},
        include: {
          model: Product,
        },
      },
    },
  });
  if (!orders) {
    return next(new AppError("Orders not found", 404));
  }
  res.status(200).json({
    status: "success",
    data: { orders },
  });
});

const getOrderByIdController = catchAsync(async (req, res, next) => {
  const { order } = req;
  res.status(200).json({
    status: "success",
    data: { order },
  });
});

module.exports = {
  createNewUserController,
  loginUserController,
  getProductsByUserController,
  updateUserCredentialsController,
  softDeleteUserController,
  getOrdersController,
  getOrderByIdController,
};
