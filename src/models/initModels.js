const { Cart } = require("./Cart.model");
const { Category } = require("./Category.model");
const { Order } = require("./Order.model");
const { Product } = require("./Product.model");
const { ProductImgs } = require("./ProductImgs.model");
const { ProductsInCart } = require("./ProductsInCart.model");
const { User } = require("./User.model");

const initModels = () => {
  // 1 User <----> M Order
  User.hasMany(Order, {
    foreignKey: "userId",
  });
  Order.belongsTo(User);

  // 1 User <----> M Product
  User.hasMany(Product, {
    foreignKey: "userId",
  });
  Product.belongsTo(User);

  // 1 User <----> 1 Cart
  User.hasOne(Cart, {
    foreignKey: "userId",
  });
  Cart.belongsTo(User);

  // 1 Cart <----> 1 Order
  Cart.hasOne(Order, {
    foreignKey: "cartId",
  });
  Order.belongsTo(Cart);

  // 1 Cart <----> M ProductsInCart
  Cart.hasMany(ProductsInCart, {
    foreignKey: "cartId",
  });
  ProductsInCart.belongsTo(Cart);

  // 1 Product <----> 1 ProductsInCart
  Product.hasOne(ProductsInCart, {
    foreignKey: "productId",
  });
  ProductsInCart.belongsTo(Product);

  // 1 Product <----> M ProductImgs
  Product.hasMany(ProductImgs, {
    foreignKey: "productId",
  });
  ProductImgs.belongsTo(Product);

  // 1 Category <----> M Products
  Category.hasMany(Product, {
    foreignKey: "categoryId",
  });
  Product.belongsTo(Category);
};

module.exports = { initModels };
