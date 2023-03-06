import express from 'express';

import authController from '../controllers/authController.js';
import authMiddleware from '../middleware/authMiddleware.js';
import userController from '../controllers/userController.js';

const router = express.Router();

router.post('/register', userController.registerUser);

router.use(authMiddleware.protect);

router.get(
  '/stats',
  authController.restrictTo('admin'),
  userController.getUserStats
);

router.patch('/update-me', userController.updateMe);

router.get('/me', userController.getMe, userController.getUser);

router.delete('/delete-me', userController.deleteMe);

router
  .route('/')
  .get(authController.restrictTo('admin'), userController.getAllUsers)
  .post(userController.createUser);

router.use(authController.restrictTo('admin'));

router
  .route('/:id')
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

export default router;
