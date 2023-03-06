import express from 'express';

import authMiddleware from '../middleware/authMiddleware.js';
import authController from '../controllers/authController.js';

const router = express.Router();

router.post('/login', authController.loginUser);

router.post('/forgot-password', authController.forgotPassword);

router.post('/reset-password/:token', authController.resetPassword);

router.patch(
  '/update-my-password',
  authMiddleware.protect,
  authController.updateMyPassword,
);

export default router;
