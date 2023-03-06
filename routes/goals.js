import express from 'express';

import authController from '../controllers/authController.js';
import authMiddleware from '../middleware/authMiddleware.js';
import goalController from '../controllers/goalController.js';

const router = express.Router();

router.use(protect);

router.get(
  '/admin',
  authController.restrictTo('admin'),
  goalController.getAllGoalsByAdmin
);

router.get('/search', goalController.searchGoal);

router.get('/details/:slug', goalController.getAllGoalBySlug);

router
  .route('/')
  .get(goalController.getAllGoals)
  .post(goalController.createGoal);

router
  .route('/:id')
  .get(goalController.getGoalById)
  .patch(goalController.updateGoal)
  .delete(goalController.deleteGoal);

module.exports = router;
