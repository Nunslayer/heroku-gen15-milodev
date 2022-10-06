const { Router } = require("express");
const {
  setProductToCartController,
  updateProductsInCartController,
  deleteProductInCartController,
  purchaseCartController,
} = require("../controllers/cart.controllers");
const { sessionProtect } = require("../middlewares/auth.middlewares");

const cartRouter = Router();

//Cart Endpoints
cartRouter.use(sessionProtect);
//Agregar un producto al carrito del usuario (enviar productId y quantity por req.body)
cartRouter.post("/add-product", setProductToCartController);

//Actualizar algun producto del carrito (incrementar o decrementar cantidad {productId, newQty})
cartRouter.patch("/update-cart", updateProductsInCartController);

//Remover producto del carrito
cartRouter.delete("/:productId", deleteProductInCartController);

//Realizar compra de todos los productos en el carrito con status active
cartRouter.post("/purchase", purchaseCartController);

module.exports = { cartRouter };
