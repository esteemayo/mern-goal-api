import { StatusCodes } from 'http-status-codes';
import _ from 'lodash';
import asyncHandler from 'express-async-handler';

import User from '../models/User.js';
import Goal from '../models/Goal.js';
import BadRequestError from '../errors/badRequest.js';
import factory from './handlerFactory.js';
import createSendToken from '../utils/createSendToken.js';

const registerUser = asyncHandler(async (req, res, next) => {
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

const getUserStats = asyncHandler(async (req, res, next) => {
  const stats = await User.getUserStats();

  res.status(StatusCodes.OK).json({
    status: 'success',
    nbHits: stats.length,
    requestedAt: req.requestTime,
    stats,
  });
});

const updateMe = asyncHandler(async (req, res, next) => {
  const { password, confirmPassword } = req.body;

  if (password || confirmPassword) {
    return next(
      new BadRequestError(
        `This route is not for password updates. Please use update ${req.protocol
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

const deleteMe = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(req.user.id, { active: false });
  await Goal.deleteMany({ user: user._id });

  res.status(StatusCodes.NO_CONTENT).json({
    status: 'success',
    user: null,
  });
});

const getMe = (req, res, next) => {
  req.params.id = req.user.id;
  next();
};

const createUser = (req, res) => {
  res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
    status: 'fail',
    message: `This route is not defined! Please use ${req.protocol}://${req.get(
      'host'
    )}/api/v1/users/register`,
  });
};

const getAllUsers = factory.getAll(User);
const getUser = factory.getOne(User);
const updateUser = factory.updateOne(User);
const deleteUser = factory.deleteOne(User);

const userController = {
  registerUser,
  getUserStats,
  updateMe,
  deleteMe,
  getMe,
  createUser,
  getAllUsers,
  getUser,
  updateUser,
  deleteUser,
};

export default userController;
