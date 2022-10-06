const { verify } = require("jsonwebtoken");
const { User } = require("../models/User.model");
const { AppError } = require("../utils/appError.util");
const { catchAsync } = require("../utils/catchAsync.util");

const sessionProtect = catchAsync(async (req, res, next) => {
  const { authorization } = req.headers;
  let token;
  if (authorization && authorization.startsWith("Bearer")) {
    token = authorization.split(" ")[1];
  }

  if (!token) {
    return next(new AppError("The token was invalid", 403));
  }

  const jwt = verify(token, process.env.JWT_SECRET);
  const user = await User.findOne({
    where: { id: jwt.id, status: "active" },
  });
  if (!user) {
    return next(
      new AppError("The owner of the session is no longer active", 403)
    );
  }

  req.sessionUser = user;
  next();
});

const protectUsersAccountMiddleware = catchAsync(async (req, res, next) => {
  const { sessionUser, user } = req;

  if (sessionUser.id !== user.id) {
    return next(new AppError("You are not the owner of this account.", 403));
  }
  next();
});

const protectOrderMiddleware = catchAsync(async (req, res, next) => {
  const { sessionUser, order } = req;
  if (sessionUser.id !== order.userId) {
    return next(new AppError("You are not the owner of this Order"));
  }
  next();
});

module.exports = {
  sessionProtect,
  protectUsersAccountMiddleware,
  protectOrderMiddleware,
};
