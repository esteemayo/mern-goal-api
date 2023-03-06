import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import mongoSanitize from 'express-mongo-sanitize';
import xss from 'xss-clean';
import compression from 'compression';
import hpp from 'hpp';
import cookieParser from 'cookie-parser';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import { StatusCodes } from 'http-status-codes';
import dotenv from 'dotenv';

const swaggerDoc = YAML.load('./swagger.yaml');

// requiring routes
import goalRouter from './routes/goals.js';
import authRouter from './routes/auth.js';
import userRouter from './routes/users.js';
import errorHandlerMiddleware from './middleware/errorHandler.js';
import NotFoundError from './errors/notFound.js';

// start express app
const app = express();

// global middlewares
app.set('trust proxy', 1);
// implement CORS
app.use(cors());

// Access-Control-Allow-Origin
app.options('*', cors());

// set security HTTP headers
app.use(helmet());

// development logging
if (app.get('env') === 'development') {
  app.use(morgan('dev'));
}

// limit request from same api
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP, Please try again in an hour!',
});

app.use('/api', limiter);

// body Parser, reading data from body into req.body
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// cookie parser middleware
app.use(cookieParser());

// data sanitization against NoSQL query injection
app.use(mongoSanitize());

// data sanitization against XSS
app.use(xss());

// prevent parameter pollution
app.use(hpp());

// compression middleware
app.use(compression());

// test middleware
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

// swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDoc));

app.get('/', (req, res) => {
  res
    .status(StatusCodes.OK)
    .send('<div><h1>Goal-API</h1><a href="/api-docs">Documentation</a></div>');
});

// routes middleware
app.use('/api/v1/goals', goalRouter);
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/users', userRouter);

app.all('*', (req, res, next) =>
  next(new NotFoundError(`Can't find ${req.originalUrl} on this server`))
);

app.use(errorHandlerMiddleware);

export default app;
