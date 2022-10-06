const { Cart } = require("../models/Cart.model");
const { Order } = require("../models/Order.model");
const { Product } = require("../models/Product.model");
const { ProductsInCart } = require("../models/ProductsInCart.model");
const { AppError } = require("../utils/appError.util");
const { catchAsync } = require("../utils/catchAsync.util");

const orderExistsMiddleware = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const order = await Order.findOne({
    where: {
      id,
    },
    // include: {
    //   model: Cart,
    //   include: {
    //     model: ProductsInCart,
    //     where: {
    //       status: "purchased",
    //     },
    //     // attributes:{exclude: []},
    //     include: {
    //       model: Product,
    //     },
    //   },
    // },
  });
  if (!order) {
    return next(new AppError("Order not found", 404));
  }
  req.order = order;
  next();
});

module.exports = { orderExistsMiddleware };
