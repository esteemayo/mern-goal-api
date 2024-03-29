import express from 'express';

import authMiddleware from '../middleware/authMiddleware.js';
import userController from '../controllers/userController.js';

const router = express.Router();

router.post('/register', userController.registerUser);

router.use(authMiddleware.protect);

router.get(
  '/stats',
  authMiddleware.restrictTo('admin'),
  userController.getUserStats
);

router.patch('/update-me', userController.updateMe);

router.get('/me', userController.getMe, userController.getUser);

router.delete('/delete-me', userController.deleteMe);

router
  .route('/')
  .get(authMiddleware.restrictTo('admin'), userController.getAllUsers)
  .post(userController.createUser);

router
  .route('/:id')
  .get(authMiddleware.verifyUser, userController.getUser)
  .patch(authMiddleware.restrictTo('admin'), userController.updateUser)
  .delete(authMiddleware.restrictTo('admin'), userController.deleteUser);

export default router;
