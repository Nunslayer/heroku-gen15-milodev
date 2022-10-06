const { Category } = require("../models/Category.model");
const { Product } = require("../models/Product.model");
const { AppError } = require("../utils/appError.util");
const { catchAsync } = require("../utils/catchAsync.util");

const productExistsMiddleware = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const product = await Product.findOne({
    include: {
      model: Category,
    },
    where: {
      id,
    },
  });
  if (!product) {
    return next(new AppError("Product not found", 404));
  }
  req.product = product;
  next();
});

const protectProductOwnerMiddleware = catchAsync(async (req, res, next) => {
  const { sessionUser, product } = req;
  if (sessionUser.id !== product.userId) {
    return next(
      new AppError(
        "Wrong credentials, this products have a different owner",
        400
      )
    );
  }
  next();
});

module.exports = { productExistsMiddleware, protectProductOwnerMiddleware };
