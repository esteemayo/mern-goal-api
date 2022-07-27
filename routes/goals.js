const express = require('express');

const protect = require('../middleware/authMiddleware');
const authController = require('../controllers/authController');
const goalController = require('../controllers/goalController');

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
