const { Router } = require("express");
const {
  loginUserController,
  createNewUserController,
  getProductsByUserController,
  updateUserCredentialsController,
  softDeleteUserController,
  getOrdersController,
  getOrderByIdController,
} = require("../controllers/users.controllers");
const {
  sessionProtect,
  protectUsersAccountMiddleware,
  protectOrderMiddleware,
} = require("../middlewares/auth.middlewares");
const { orderExistsMiddleware } = require("../middlewares/orders.middlewares");
const { userExistsMiddleware } = require("../middlewares/users.middlewares");
const {
  createUserValidations,
  checkValidations,
} = require("../middlewares/validations.middlewares");

const usersRouter = Router();

//Users endpoints
//Crear usuario (enviar username, email, y password por req.body)
usersRouter.post(
  "/",
  createUserValidations,
  checkValidations,
  createNewUserController
);

//Iniciar sesion (enviar email y password por req.body)
usersRouter.post("/login", loginUserController);

//End points Protegidos
usersRouter.use(sessionProtect);

//Obtener los productos que el usuario ha creado
usersRouter.get("/me", getProductsByUserController);

//Actualizar perfil de usuario (solo username y email)
usersRouter.patch(
  "/:id",
  userExistsMiddleware,
  protectUsersAccountMiddleware,
  updateUserCredentialsController
);

//Deshabilitar cuenta de usuario
usersRouter.delete(
  "/:id",
  userExistsMiddleware,
  protectUsersAccountMiddleware,
  softDeleteUserController
);

//Obtener todas las compras hechas por el usuario
usersRouter.get("/orders", getOrdersController);

//Obtener detalles de una sola orden dado un ID
usersRouter.get(
  "/orders/:id",
  orderExistsMiddleware,
  protectOrderMiddleware,
  getOrderByIdController
);

module.exports = { usersRouter };
