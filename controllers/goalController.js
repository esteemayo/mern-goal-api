const { StatusCodes } = require('http-status-codes');
const asyncHandler = require('express-async-handler');

const Goal = require('../models/Goal');
const APIFeatures = require('../utils/apiFeatures');
const NotFoundError = require('../errors/notFound');
const ForbiddenError = require('../errors/forbidden');

exports.getAllGoals = asyncHandler(async (req, res, next) => {
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

exports.getGoalById = asyncHandler(async (req, res, next) => {
  const { id: goalId } = req.params;

  const goal = await Goal.findById(goalId);

  if (!goal) {
    return next(new NotFoundError(`No goal found with that ID → ${goalId}`));
  }

  res.status(StatusCodes.OK).json({
    status: 'success',
    goal,
  });
});

exports.getAllGoalBySlug = asyncHandler(async (req, res, next) => {
  const { slug } = req.params;

  const goal = await Goal.findOne({ slug });

  if (!goal) {
    return next(new NotFoundError(`No goal found with that ID → ${slug}`));
  }

  res.status(StatusCodes.OK).json({
    status: 'success',
    goal,
  });
});

exports.createGoal = asyncHandler(async (req, res, next) => {
  const goal = await Goal.create({ ...req.body });

  res.status(StatusCodes.CREATED).json({
    status: 'success',
    goal,
  });
});

exports.updateGoal = asyncHandler(async (req, res, next) => {
  const { id: goalId } = req.params;

  const goal = await Goal.findById(goalId);

  if (!goal) {
    return next(new NotFoundError(`No goal found with that ID → ${goalId}`));
  }

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
});

exports.deleteGoal = asyncHandler(async (req, res, next) => {
  const { id: goalId } = req.params;

  const goal = await Goal.findById(goalId);

  if (!goal) {
    return next(new NotFoundError(`No goal found with that ID → ${goalId}`));
  }

  await goal.remove();

  res.status(StatusCodes.NO_CONTENT).json({
    status: 'success',
    goal: null,
  });
});
