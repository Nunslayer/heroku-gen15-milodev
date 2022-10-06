const { User } = require("../models/User.model");
const { AppError } = require("../utils/appError.util");
const { catchAsync } = require("../utils/catchAsync.util");

const userExistsMiddleware = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const user = await User.findOne({
    attributes: { exclude: ["password"] },
    where: {
      id,
    },
  });
  if (!user) {
    return next(new AppError("User not found", 404));
  }

  req.user = user;
  next();
});
module.exports = { userExistsMiddleware };
