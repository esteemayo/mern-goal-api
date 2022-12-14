const { StatusCodes } = require('http-status-codes');
const asyncHandler = require('express-async-handler');

const Goal = require('../models/Goal');
const APIFeatures = require('../utils/apiFeatures');
const NotFoundError = require('../errors/notFound');
const ForbiddenError = require('../errors/forbidden');

exports.getAllGoals = asyncHandler(async (req, res, next) => {
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

exports.getAllGoalsByAdmin = asyncHandler(async (req, res, next) => {
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

exports.searchGoal = asyncHandler(async (req, res, next) => {
  const { q } = req.query;
  const text = new RegExp(q, 'i');

  const goals = await Goal.find({ text, user: req.user.id });

  res.status(StatusCodes.OK).json({
    status: 'success',
    goals,
  });
});

exports.getGoalById = asyncHandler(async (req, res, next) => {
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

exports.getAllGoalBySlug = asyncHandler(async (req, res, next) => {
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

exports.createGoal = asyncHandler(async (req, res, next) => {
  if (!req.body.user) req.body.user = req.user.id;

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

exports.deleteGoal = asyncHandler(async (req, res, next) => {
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
