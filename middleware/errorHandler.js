const { StatusCodes } = require('http-status-codes');

const sendErrorDev = (err, res) =>
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    stack: err.stack,
  });

const sendErrorProd = (err, res) =>
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });

const globalErrorHandler = (err, req, res, next) => {
  const customError = {
    statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    message: err.message || 'Something went very wrong',
    status: err.status,
    stack: err.stack,
  };

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(customError, res);
  } else if (process.env.NODE_ENV === 'production') {
    sendErrorProd(customError, res);
  }
};

module.exports = globalErrorHandler;
