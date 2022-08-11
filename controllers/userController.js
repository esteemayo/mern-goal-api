const _ = require('lodash');
const { StatusCodes } = require('http-status-codes');
const asyncHandler = require('express-async-handler');

const User = require('../models/User');
const Goal = require('../models/Goal');
const BadRequestError = require('../errors/badRequest');
const factory = require('./handlerFactory');
const createSendToken = require('../utils/createSendToken');

exports.registerUser = asyncHandler(async (req, res, next) => {
  const userData = _.pick(req.body, [
    'name',
    'email',
    'role',
    'avatar',
    'password',
    'confirmPassword',
    'passwordChangedAt',
  ]);

  const user = await User.create({ ...userData });

  if (user) {
    createSendToken(user, StatusCodes.CREATED, req, res);
  }
});

exports.getUserStats = asyncHandler(async (req, res, next) => {
  const date = new Date();
  const lastYear = new Date(date.setFullYear(date.getFullYear() - 1));
  const prevYear = new Date(date.setFullYear(lastYear.getFullYear() - 1));

  const stats = await User.aggregate([
    {
      $match: { createdAt: { $gte: prevYear } },
    },
    {
      $project: {
        month: { $month: '$createdAt' },
      },
    },
    {
      $group: {
        _id: '$month',
        total: { $sum: 1 },
      },
    },
  ]);

  res.status(StatusCodes.OK).json({
    status: 'success',
    nbHits: stats.length,
    requestedAt: req.requestTime,
    stats,
  });
});

exports.updateMe = asyncHandler(async (req, res, next) => {
  const { password, confirmPassword } = req.body;

  if (password || confirmPassword) {
    return next(
      new BadRequestError(
        `This route is not for password updates. Please use update ${
          req.protocol
        }://${req.get('host')}/api/v1/auth/update-my-password`
      )
    );
  }

  const filterBody = _.pick(req.body, ['name', 'email', 'avatar']);
  const updatedUser = await User.findByIdAndUpdate(
    req.user.id,
    { $set: { ...filterBody } },
    {
      new: true,
      runValidators: true,
    }
  );

  res.status(StatusCodes.OK).json({
    status: 'success',
    user: updatedUser,
  });
});

exports.deleteMe = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(req.user.id, { active: false });
  await Goal.deleteMany({ user: user._id });

  res.status(StatusCodes.NO_CONTENT).json({
    status: 'success',
    user: null,
  });
});

exports.getMe = (req, res, next) => {
  req.params.id = req.user.id;
  next();
};

exports.createUser = (req, res) => {
  res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
    status: 'fail',
    message: `This route is not defined! Please use ${req.protocol}://${req.get(
      'host'
    )}/api/v1/users/register`,
  });
};

exports.getAllUsers = factory.getAll(User);
exports.getUser = factory.getOne(User);
exports.updateUser = factory.updateOne(User);
exports.deleteUser = factory.deleteOne(User);
