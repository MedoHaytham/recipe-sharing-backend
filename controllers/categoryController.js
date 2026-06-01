const Category = require('../models/category');
const Recipe = require('../models/recipe');
const factory = require('./handlerFactory');
const asyncWrapper = require('../utils/asyncWrapper');
const AppError = require('../utils/appError');
const httpStatus = require('../utils/httpStatusText');

// GET all categories
exports.getAllCategories = factory.getAll(Category);

// POST create category
exports.createCategory = factory.createOne(Category);

// DELETE category by ID
exports.deleteCategory = asyncWrapper(async (req, res, next) => {
  const category = await Category.findById(req.params.id);
  
  if (!category) {
    return next(new AppError('No category found with that ID', 404));
  }

  // Check if any recipe is associated with this category name
  const recipeExists = await Recipe.findOne({ category: category.name });
  if (recipeExists) {
    return next(new AppError('Cannot delete category because it contains recipes!', 400));
  }

  await Category.findByIdAndDelete(req.params.id);

  res.status(204).json({
    status: httpStatus.SUCCESS,
    data: null
  });
});
