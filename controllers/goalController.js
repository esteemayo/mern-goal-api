import { StatusCodes } from 'http-status-codes';
import asyncHandler from 'express-async-handler';

import Goal from '../models/Goal.js';
import APIFeatures from '../utils/apiFeatures.js';
import NotFoundError from '../errors/notFound.js';
import ForbiddenError from '../errors/forbidden.js';

const getAllGoals = asyncHandler(async (req, res, next) => {
  const features = new APIFeatures(Goal.find({ user: req.user.id }), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();

  const goals = await features.query;

  res.status(StatusCodes.OK).json({
    status: 'success',
    nbHits: goals.length,
    requestedAt: req.requestTime,
    goals,
  });
});

const getAllGoalsByAdmin = asyncHandler(async (req, res, next) => {
  const features = new APIFeatures(Goal.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();

  const goals = await features.query;

  res.status(StatusCodes.OK).json({
    status: 'success',
    nbHits: goals.length,
    requestedAt: req.requestTime,
    goals,
  });
});

const searchGoal = asyncHandler(async (req, res, next) => {
  const { q } = req.query;
  const text = new RegExp(q, 'i');

  const goals = await Goal.find({ text, user: req.user.id });

  res.status(StatusCodes.OK).json({
    status: 'success',
    goals,
  });
});

const getGoalById = asyncHandler(async (req, res, next) => {
  const { id: goalId } = req.params;

  const goal = await Goal.findById(goalId);

  if (!goal) {
    return next(new NotFoundError(`No goal found with that ID → ${goalId}`));
  }

  if (String(goal.user._id) === req.user.id || req.user.role === 'admin') {
    res.status(StatusCodes.OK).json({
      status: 'success',
      goal,
    });
  }

  return next(
    new ForbiddenError('You are not permitted to perform this action')
  );
});

const getAllGoalBySlug = asyncHandler(async (req, res, next) => {
  const { slug } = req.params;

  const goal = await Goal.findOne({ slug });

  if (!goal) {
    return next(new NotFoundError(`No goal found with that SLUG → ${slug}`));
  }

  if (String(goal.user._id) === req.user.id || req.user.role === 'admin') {
    res.status(StatusCodes.OK).json({
      status: 'success',
      goal,
    });
  }

  return next(
    new ForbiddenError('You are not permitted to perform this action')
  );
});

const createGoal = asyncHandler(async (req, res, next) => {
  if (!req.body.user) req.body.user = req.user.id;

  const goal = await Goal.create({ ...req.body });

  res.status(StatusCodes.CREATED).json({
    status: 'success',
    goal,
  });
});

const updateGoal = asyncHandler(async (req, res, next) => {
  const { id: goalId } = req.params;

  const goal = await Goal.findById(goalId);

  if (!goal) {
    return next(new NotFoundError(`No goal found with that ID → ${goalId}`));
  }

  if (String(goal.user._id) === req.user.id || req.user.role === 'admin') {
    const updatedGoal = await Goal.findByIdAndUpdate(
      goalId,
      { $set: { ...req.body } },
      {
        new: true,
        runValidators: true,
      }
    );

    res.status(StatusCodes.OK).json({
      status: 'success',
      goal: updatedGoal,
    });
  }

  return next(
    new ForbiddenError('You are not permitted to perform this action')
  );
});

const deleteGoal = asyncHandler(async (req, res, next) => {
  const { id: goalId } = req.params;

  const goal = await Goal.findById(goalId);

  if (!goal) {
    return next(new NotFoundError(`No goal found with that ID → ${goalId}`));
  }

  if (String(goal.user._id) === req.user.id || req.user.role === 'admin') {
    await goal.remove();

    res.status(StatusCodes.NO_CONTENT).json({
      status: 'success',
      goal: null,
    });
  }

  return next(
    new ForbiddenError('You are not permitted to perform this action')
  );
});

const goalController = {
  getAllGoals,
  getAllGoalsByAdmin,
  searchGoal,
  getGoalById,
  getAllGoalBySlug,
  createGoal,
  updateGoal,
  deleteGoal,
};

export default goalController;
