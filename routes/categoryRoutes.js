const express = require('express');
const categoryController = require('../controllers/categoryController');
const recipeController = require('../controllers/recipeController');
const { verifyToken } = require('../middleware/verifyToken');
const { allowedTo } = require('../middleware/allowedTo');
const { USER_ROLES } = require('../utils/usersRoles');

const router = express.Router();

// Public Routes
router.route('/')
  .get(categoryController.getAllCategories);

// GET all recipes for a specific category (by category name)
router.get('/:categoryName/recipes', recipeController.setCategoryFilter, recipeController.getAllRecipes);

// Protected Routes (Authentication Required & Admin Only)
router.use(verifyToken);
router.use(allowedTo(USER_ROLES.ADMIN));

router.route('/')
  .post(allowedTo(USER_ROLES.ADMIN), categoryController.createCategory);

router.route('/:id')
  .delete(allowedTo(USER_ROLES.ADMIN), categoryController.deleteCategory);

module.exports = router;
