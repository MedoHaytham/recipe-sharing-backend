const express = require('express');
const recipeController = require('../controllers/recipeController');
const { verifyToken } = require('../middleware/verifyToken');
const { allowedTo } = require('../middleware/allowedTo');
const { USER_ROLES } = require('../utils/usersRoles');

const router = express.Router();

// Public Routes
router.route('/')
  .get(recipeController.getAllRecipes);

router.route('/:id')
  .get(recipeController.getRecipe);

// Protected Routes (Authentication Required)
router.use(verifyToken);

router.delete('/deleteMyRecipe/:id', recipeController.deleteMyRecipe);

router.route('/')
  .post(recipeController.setRecipeCreator, recipeController.createRecipe);

router.route('/:id')
  .delete(allowedTo(USER_ROLES.ADMIN), recipeController.deleteRecipe);

module.exports = router;

