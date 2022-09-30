const { Router } = require("express");

const productsRouter = Router();

//Products Endpoints

//Crear un producto (enviar title, description, price (INT), categoryId y quantity por req.body, adjuntar el userId de la sesion)
productsRouter.post("/", createProductController);

//Obtener todos los productos disponibles (status 'active')
productsRouter.get("/", getActiveProductsController);

//Obtener producto por Id
productsRouter.get("/:id", getActiveProductByIdController);

//Actualizar producto (title, description, price, quantity) SOLO EL USUARIO QUIEN CREO EL PRODUCTO
productsRouter.patch("/:id", updateProductDataController);

//Deshabilitar producto. SOLO EL USUARIO QUIEN CREO EL PRODUCTO
productsRouter.delete("/:id", softDeleteProductController);

//Obtener todas las categorias activas
productsRouter.get("/categories", getActiveCategoriesController);

//Agregar una nueva categoria
productsRouter.post("/categories", createCategoryController);

//Actualizar el nombre de la categoria
productsRouter.patch("/categories/:id", updateCategoryDataController);

module.exports = { productsRouter };
