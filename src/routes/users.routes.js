const { Router } = require("express");

const usersRouter = Router();

//Users endpoints
//Crear usuario (enviar username, email, y password por req.body)
usersRouter.post("/", createNewUserController);

//Iniciar sesion (enviar email y password por req.body)
usersRouter.post("/login", loginUserController);

//Obtener los productos que el usuario ha creado
usersRouter.get("/me", getProductsByUserController);

//Actualizar perfil de usuario (solo username y email)
usersRouter.patch("/:id", updateUserCredentialsController);

//Deshabilitar cuenta de usuario
usersRouter.delete("/:id", softDeleteUserController);

//Obtener todas las compras hechas por el usuario
usersRouter.get("/orders", getOrdersController);

//Obtener detalles de una sola orden dado un ID
usersRouter.get("/orders/:id", getOrderByIdController);

module.exports = { usersRouter };
