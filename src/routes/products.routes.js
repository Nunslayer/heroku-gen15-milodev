const { Router } = require("express");
const {
  getActiveCategoriesController,
  createCategoryController,
  updateCategoryDataController,
} = require("../controllers/categories.controllers");
const {
  getActiveProductsController,
  createProductController,
  getActiveProductByIdController,
  updateProductDataController,
  softDeleteProductController,
} = require("../controllers/products.controllers");
const { sessionProtect } = require("../middlewares/auth.middlewares");
const {
  productExistsMiddleware,
  protectProductOwnerMiddleware,
} = require("../middlewares/products.middlewares");
const {
  createProductValidations,
  checkValidations,
  createCategoryValidations,
} = require("../middlewares/validations.middlewares");
const { upload } = require("../utils/multer.util");

const productsRouter = Router();

//Products Endpoints
//Obtener todos los productos disponibles (status 'active')
productsRouter.get("/", getActiveProductsController);

//Obtener producto por Id
productsRouter.get(
  "/:id",
  productExistsMiddleware,
  getActiveProductByIdController
);

//Obtener todas las categorias activas
productsRouter.get("/categories", getActiveCategoriesController);

productsRouter.use(sessionProtect);

//Crear un producto (enviar title, description, price (INT), categoryId y quantity por req.body, adjuntar el userId de la sesion)
productsRouter.post(
  "/",
  upload.array("productImg", 5),
  createProductValidations,
  checkValidations,
  createProductController
);

//Actualizar producto (title, description, price, quantity) SOLO EL USUARIO QUIEN CREO EL PRODUCTO
productsRouter.patch(
  "/:id",
  productExistsMiddleware,
  protectProductOwnerMiddleware,
  updateProductDataController
);

//Deshabilitar producto. SOLO EL USUARIO QUIEN CREO EL PRODUCTO
productsRouter.delete(
  "/:id",
  productExistsMiddleware,
  protectProductOwnerMiddleware,
  softDeleteProductController
);

//Agregar una nueva categoria
productsRouter.post(
  "/categories",
  createCategoryValidations,
  checkValidations,
  createCategoryController
);

//Actualizar el nombre de la categoria
productsRouter.patch("/categories/:id", updateCategoryDataController);

module.exports = { productsRouter };
