const { Category } = require("../models/Category.model");
const { AppError } = require("../utils/appError.util");
const { catchAsync } = require("../utils/catchAsync.util");

const getActiveCategoriesController = catchAsync(async (req, res, next) => {
  const categories = await Category.findAll();
  if (!categories) {
    return next(new AppError("Not found categories", 404));
  }
  res.status(200).json({
    status: "success",
    data: { categories },
  });
});

const createCategoryController = catchAsync(async (req, res, next) => {
  const { name } = req.body;
  const newCategory = await Category.create({ name });
  res.status(201).json({
    status: "success",
    data: { newCategory },
  });
});

const updateCategoryDataController = catchAsync(async (req, res, next) => {
  const { newName } = req.body;
  const { id } = req.params;
  const category = await Category.findOne({
    where: { id, status: "active" },
  });
  if (!category) {
    return next(new AppError("Category does not exits with given id", 404));
  }
  if (newName.length === 0) {
    return next(new AppError("The updated name cannot be empty", 400));
  }
  await category.update({ name: newName });
  res.status(200).json({ status: "success" });
});

module.exports = {
  getActiveCategoriesController,
  createCategoryController,
  updateCategoryDataController,
};
