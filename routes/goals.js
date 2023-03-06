import express from 'express';

import authController from '../controllers/authController.js';
import authMiddleware from '../middleware/authMiddleware.js';
import goalController from '../controllers/goalController.js';

const router = express.Router();

router.use(authMiddleware.protect);

router.get(
  '/admin',
  authMiddleware.restrictTo('admin'),
  goalController.getAllGoalsByAdmin
);

router.get('/search', goalController.searchGoal);

router.get('/details/:slug', goalController.getGoalBySlug);

router
  .route('/')
  .get(goalController.getAllGoals)
  .post(goalController.createGoal);

router
  .route('/:id')
  .get(goalController.getGoalById)
  .patch(goalController.updateGoal)
  .delete(goalController.deleteGoal);

export default router;
