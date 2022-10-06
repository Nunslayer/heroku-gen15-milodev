const { AppError } = require("../utils/appError.util");

const sendErrorDevelopment = (error, req, res) => {
  res.status(error.statusCode).json({
    status: error.status,
    message: error.message,
    error,
    stack: error.stack,
  });
};

const sendErrorProduction = (error, req, res) => {
  res.status(error.statusCode).json({
    status: error.status,
    message: error.message || "Something went wrong!",
  });
};

const tokenExpiredError = () => {
  return new AppError("Session invalid, please login again", 401);
};

const tokeInvalidSignatureError = () => {
  return new AppError("Session invalid, please login again.", 401);
};

const dbUniqueConstrainError = () => {
  return new AppError("The entered email has already been taken", 400);
};

const globalErrorHandler = (error, req, res, next) => {
  error.statusCode = error.statusCode || 500;
  error.status = error.status || "fail";

  if (process.env.NODE_ENV === "development") {
    sendErrorDevelopment(error, req, res);
  } else if (process.env.NODE_ENV === "production") {
    let err = { ...error };
    if (error.name === "TokenExpiredError") err = tokenExpiredError();
    else if (error.name === "JsonWebTokenError")
      err = tokeInvalidSignatureError();
    else if (error.name === "SequelizeUniqueConstraintError")
      err = dbUniqueConstrainError();
    sendErrorProduction(err, req, res);
  }
};

module.exports = { globalErrorHandler };
