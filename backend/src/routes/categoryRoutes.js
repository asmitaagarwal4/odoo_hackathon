const express = require('express');
const router = express.Router();
const { authMiddleware, isAdmin } = require('../middleware/authMiddleware');
const { getAllCategories, createCategory, updateCategory, deleteCategory } = require('../controllers/categoryController');

// Everyone can view categories
router.get('/', getAllCategories);

// Admin can manage categories
router.post('/', authMiddleware, isAdmin, createCategory);
router.put('/:categoryId', authMiddleware, isAdmin, updateCategory);
router.delete('/:categoryId', authMiddleware, isAdmin, deleteCategory);

module.exports = router;