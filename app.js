const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorControler');

const usersRouter = require('./routes/userRoutes');
const recipeRouter = require('./routes/recipeRoutes');
const categoryRouter = require('./routes/categoryRoutes');

const app = express();

// CORS Middleware
const allowedOrigins = [
  'http://localhost:3000',
  'https://recipe-sharing-frontend-4eprxn81r-medo-haytams-projects.vercel.app'
];

app.use(
  cors({
    origin: function (origin, cb) {
      // allow requests with no origin (Postman, server-to-server, etc.)
      if (!origin) return cb(null, true);
      if (allowedOrigins.includes(origin)) return cb(null, true);

      return cb(new Error('Not allowed by CORS'));
    },
    credentials: true,
  })
);

// 1) GLOBAL MIDDLEWARES
// set security headers
app.use(helmet());

// Development logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Limit requests from same IP
const limiter = rateLimit({
  max: 10000,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP, please try again in an hour!'
});
app.use('/api', limiter);

// Body parser (reading data from body into req.body)
app.use(express.json({ limit: '10kb' }));

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Data sanitization against XSS
app.use(xss());

// Prevent parameter pollution
app.use(hpp({
  whitelist: ['category', 'difficulty', 'time', 'rating', 'reviews', 'creator']
}));

// serving static files
app.use(express.static(`${__dirname}/public`));

// 2) ROUTES
app.use('/api/v1/users', usersRouter);
app.use('/api/v1/recipes', recipeRouter);
app.use('/api/v1/categories', categoryRouter);


// 3) Handling unhandled routes (404)
app.all('*', (req, res, next) => {
  const err = new AppError(`Can't find ${req.originalUrl} on this server!`, 404);
  next(err);
});

// 4) Global error handling middleware
app.use(globalErrorHandler);

module.exports = app;