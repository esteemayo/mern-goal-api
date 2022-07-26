const { StatusCodes } = require('http-status-codes');
const asyncHandler = require('express-async-handler');

const Goal = require('../models/Goal');

exports.getAllGoals = asyncHandler(async (req, res, next) => {
  const goals = await Goal.find();

  res.status(StatusCodes.OK).json({
    status: 'success',
    nbHits: goals.length,
    goals,
  });
});

exports.getGoalById = asyncHandler(async (req, res, next) => {});

exports.getAllGoalBySlug = asyncHandler(async (req, res, next) => {});

exports.createGoal = asyncHandler(async (req, res, next) => {});

exports.updateGoal = asyncHandler(async (req, res, next) => {});

exports.deleteGoal = asyncHandler(async (req, res, next) => {});
