const express = require('express');
const router = express.Router();
const categoryController = require('../../controllers/cms/category.controller');
const { authenticate: auth } = require('../../middleware/auth');

// Get all categories
router.get('/', auth, categoryController.getAllCategories);

// Get category by ID
router.get('/:id', auth, categoryController.getCategoryById);

// Create new category
router.post('/', auth, categoryController.createCategory);

// Update category
router.put('/:id', auth, categoryController.updateCategory);

// Delete category
router.delete('/:id', auth, categoryController.deleteCategory);

// Get categories by parent
router.get('/parent/:parentId', auth, categoryController.getCategoriesByParent);

// Get root categories
router.get('/root/all', auth, categoryController.getRootCategories);

// Update category order
router.put('/:id/order', auth, categoryController.updateCategoryOrder);

module.exports = router; 