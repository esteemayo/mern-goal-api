const express = require('express');

const protect = require('../middleware/authMiddleware');
const authController = require('../controllers/authController');

const router = express.Router();

router.post('/login', authController.loginUser);

router.post('/forgot-password', authController.forgotPassword);

router.post('/reset-password/:token', authController.resetPassword);

router.patch('/update-my-password', protect, authController.updateMyPassword);

module.exports = router;
