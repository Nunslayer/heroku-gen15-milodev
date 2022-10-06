const { Cart } = require("../models/Cart.model");
const { Order } = require("../models/Order.model");
const { Product } = require("../models/Product.model");
const { ProductsInCart } = require("../models/ProductsInCart.model");
const { AppError } = require("../utils/appError.util");
const { catchAsync } = require("../utils/catchAsync.util");

const setProductToCartController = catchAsync(async (req, res, next) => {
  const { sessionUser } = req;
  const { productId, quantity } = req.body;

  const product = await Product.findOne({
    where: {
      id: productId,
      status: "active",
    },
  });
  if (!product) {
    return next(new AppError("Product not exists", 404));
  } else if (quantity > product.quantity) {
    return next(
      new AppError(`This product only has ${product.quantity} items.`, 400)
    );
  }
  const cart = await Cart.findOne({
    where: {
      userId: sessionUser.id,
      status: "active",
    },
  });
  if (!cart) {
    const newCart = await Cart.create({
      userId: sessionUser.id,
    });
    await ProductsInCart.create({
      cartId: newCart.id,
      productId,
      quantity,
    });
  } else {
    const productInCart = await ProductsInCart.findOne({
      where: { productId, cartId: cart.id },
    });
    if (!productInCart) {
      await ProductsInCart.create({ cartId: cart.id, productId, quantity });
    } else if (productInCart.status === "active") {
      return next(
        new AppError("This product is already active in your cart", 400)
      );
    } else if (productInCart.status === "removed") {
      await productInCart.update({ status: "active", quantity });
    }
  }

  res.status(200).json({
    status: "success",
  });
});

const updateProductsInCartController = catchAsync(async (req, res, next) => {
  const { sessionUser } = req;
  const { productId, newQty } = req.body;

  const cart = await Cart.findOne({
    where: { userId: sessionUser.id, status: "active" },
  });

  if (!cart) {
    return next(new AppError("You do not have a cart active.", 400));
  }
  const product = await Product.findOne({
    where: { id: productId, status: "active" },
  });

  if (!product) {
    return next(new AppError("Product does not exists", 404));
  } else if (newQty > product.quantity) {
    return next(
      new AppError(`This product only has ${product.quantity} items.`, 400)
    );
  } else if (0 > newQty) {
    return next(new AppError("Cannot send negative values", 400));
  }

  const productInCart = await ProductsInCart.findOne({
    where: { cartId: cart.id, productId, status: "active" },
  });

  if (!productInCart) {
    return next(new AppError("This product is not in your cart", 404));
  }

  if (newQty === 0) {
    await productInCart.update({ quantity: 0, status: "removed" });
  } else if (newQty > 0) {
    await productInCart.update({ quantity: newQty });
  }

  res.status(200).json({
    status: "success",
  });
});

const deleteProductInCartController = catchAsync(async (req, res, next) => {
  const { sessionUser } = req;
  const { productId } = req.params;
  const cart = await Cart.findOne({
    where: { userId: sessionUser.id, status: "active" },
  });
  if (!cart) {
    return next(new AppError("This user does not have a cart", 400));
  }
  const productInCart = await ProductInCart.findOne({
    where: { cartId: cart.id, productId, status: "active" },
  });
  if (!productInCart) {
    return next(new AppError("This product is not in your cart", 400));
  }
  await productInCart.update({ quantity: 0, status: "removed" });
  res.status(200).json({
    status: "success",
  });
});

const purchaseCartController = catchAsync(async (req, res, next) => {
  const { sessionUser } = req;

  const cart = await Cart.findOne({
    where: { status: "active", userId: sessionUser.id },
    include: {
      model: ProductsInCart,
      status: "active",
      include: { model: Product },
    },
  });
  if (!cart) {
    return next(new AppError("This user does not have a cart", 400));
  }
  let totalPrice = 0;
  const cartPromises = cart.productInCarts.map(async (productInCart) => {
    await productInCart.update({ status: "purchased" });
    const productPrice = productInCart.product.price * productInCart.quantity;
    totalPrice += productPrice;
    const newQty = productInCart.product.quantity - productInCart.quantity;
    await productInCart.product.update({ quantity: newQty });
  });

  await Promise.all(cartPromises);
  await cart.update({ status: "purchased" });

  const newOrder = await Order.create({
    cartId: cart.id,
    userId: sessionUser.id,
    totalPrice,
  });
  res.status(201).json({
    status: "success",
    data: { newOrder },
  });
});

module.exports = {
  setProductToCartController,
  updateProductsInCartController,
  deleteProductInCartController,
  purchaseCartController,
};
