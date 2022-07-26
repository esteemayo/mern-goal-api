const express = require('express');
const morgan = require('morgan');

// requiring routes
const goalRouter = require('./routes/goals');
const globalErrorHandler = require('./middleware/errorHandler');
const NotFoundError = require('./errors/notFound');

const app = express();

if (app.get('env') === 'development') {
  app.use(morgan('dev'));
}

app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// test middleware
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

app.use('/api/v1/goals', goalRouter);

app.all('*', (req, res, next) =>
  next(new NotFoundError(`Can't find ${req.originalUrl} on this server`))
);

app.use(globalErrorHandler);

module.exports = app;
