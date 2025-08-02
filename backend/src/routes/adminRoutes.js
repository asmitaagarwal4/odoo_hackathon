const express = require('express');
const router = express.Router();
const { authMiddleware, isAdmin } = require('../middleware/authMiddleware');
const { getAllUsers, updateUserRole, deleteUser } = require('../controllers/adminController');

// All admin routes must be authenticated and have the isAdmin middleware
router.get('/users', authMiddleware, isAdmin, getAllUsers);
router.put('/users/:userId/role', authMiddleware, isAdmin, updateUserRole);
router.delete('/users/:userId', authMiddleware, isAdmin, deleteUser);

module.exports = router;