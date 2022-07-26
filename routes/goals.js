const express = require('express');

const protect = require('../middleware/authMiddleware');
const goalController = require('../controllers/goalController');

const router = express.Router();

router.use(protect);

router
  .route('/')
  .get(goalController.getAllGoals)
  .post(goalController.createGoal);

router
  .route('/:id')
  .get(goalController.getGoalById)
  .patch(goalController.updateGoal)
  .delete(goalController.deleteGoal);

router.get('/details/:slug', goalController.getAllGoalBySlug);

module.exports = router;
