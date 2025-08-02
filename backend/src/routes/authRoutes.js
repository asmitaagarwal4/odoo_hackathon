const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getMyProfile } = require('../controllers/authController');
const { authMiddleware } = require('../middleware/authMiddleware');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/me', authMiddleware, getMyProfile);

module.exports = router;