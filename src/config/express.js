const express = require("express");
const { cartRouter } = require("../routes/cart.routes");
const { productsRouter } = require("../routes/products.routes");
const { usersRouter } = require("../routes/users.routes");

const app = express();

//Static Middlewares
app.use(express.json());

//User Router
app.use("/api/v1/users", usersRouter);

//Products Router
app.use("/api/v1/products", productsRouter);

//Cart Router
app.use("/api/v1/cart", cartRouter);

//Router error
app.all("*", (req, res) => {
  res.status(404).json({
    status: "error",
    message: `${req.method} ${req.url} does not exists in our server`,
  });
});

module.exports = { app };
