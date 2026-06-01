const Recipe = require('../models/recipe');
const factory = require('./handlerFactory');
const AppError = require('../utils/appError');
const asyncWrapper = require('../utils/asyncWrapper');

// Middleware to inject current user's ID as the recipe creator
exports.setRecipeCreator = (req, res, next) => {
  if (req.currentUser) {
    req.body.creator = req.currentUser._id;
  }
  next();
};

// Middleware to filter recipes by category name (for nested route)
exports.setCategoryFilter = (req, res, next) => {
  if (req.params.categoryName) {
    // check if category name the first letter is uppercase
    if (req.params.categoryName[0] === req.params.categoryName[0].toUpperCase()) {
      req.query.category = req.params.categoryName;
    } else {
      req.query.category = req.params.categoryName[0].toUpperCase() + req.params.categoryName.slice(1);
    }
  }
  next();
};

// GET all recipes
exports.getAllRecipes = factory.getAll(Recipe);

// GET single recipe by ID (populating creator details)
exports.getRecipe = factory.getOne(Recipe, { path: 'creator', select: 'name' });

// POST create recipe (using factory after setRecipeCreator middleware runs)
exports.createRecipe = factory.createOne(Recipe);

// DELETE recipe (using standard factory, authorization is handled in routes)
exports.deleteRecipe = factory.deleteOne(Recipe);

// DELETE my recipe (only creator can delete)
exports.deleteMyRecipe = asyncWrapper(async (req, res, next) => {
  const recipe = await Recipe.findById(req.params.id);

  if (!recipe) {
    return next(new AppError('No recipe found with that ID', 404));
  }

  // Check if current user is the creator of the recipe
  if (recipe.creator.toString() !== req.currentUser.id) {
    return next(new AppError('You can only delete your own recipes!', 403));
  }

  await Recipe.findByIdAndDelete(req.params.id);

  res.status(204).json({
    status: 'success',
    data: null
  });
});
