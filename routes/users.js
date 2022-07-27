const express = require('express');

const protect = require('../middleware/authMiddleware');
const authController = require('../controllers/authController');
const userController = require('../controllers/userController');

const router = express.Router();

router.post('/register', userController.registerUser);

router.use(protect);

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

module.exports = router;
