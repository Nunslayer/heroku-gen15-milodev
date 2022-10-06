const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const compression = require("compression");
const morgan = require("morgan");
const { globalErrorHandler } = require("../controllers/error.controllers");
const { cartRouter } = require("../routes/cart.routes");
const { productsRouter } = require("../routes/products.routes");
const { usersRouter } = require("../routes/users.routes");

const app = express();

//Static Middlewares
app.use(cors());
app.use(express.json());
app.use(helmet());
app.use(compression());
if (process.env.NODE_ENV === "development") app.use(morgan("dev"));
else if (process.env.NODE_ENV === "production") app.use(morgan("combined"));
app.use(morgan("dev"));
//User Router
app.use("/api/v1/users", usersRouter);

//Products Router
app.use("/api/v1/products", productsRouter);

// Cart Router
app.use("/api/v1/cart", cartRouter);

//Global error handler
app.use(globalErrorHandler);

//Router error
app.all("*", (req, res) => {
  res.status(404).json({
    status: "error",
    message: `${req.method} ${req.url} does not exists in our server`,
  });
});

module.exports = { app };
