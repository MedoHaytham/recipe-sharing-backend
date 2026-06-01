/* eslint-disable node/no-unsupported-features/es-syntax */
const httpStatusText = require('../utils/httpStatusText');
const AppError = require('../utils/appError');

const handleCastErrorDB = err => {
  const message = `Invalid ${err.path}: ${err.value}`;
  return new AppError(message, 400);
}

const handleDuplicateKeysDB = err => {
  const message = `The ${Object.keys(err.keyValue).join(', ')} "${Object.values(err.keyValue).join(', ')}" is already exists.`;
  return new AppError(message, 400);
}

const handleValidationError = err => {
  const messages = Object.values(err.errors).map( error => error.message );
  const message = `Invalid input data. ${messages.join(' && ')}.`;
  return new AppError(message, 400);
}

const handleJWTError = err => {
  const message = `Invalid or expired Token. ${err.message}`;
  return new AppError(message, 401);
}

const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    stack: err.stack,
    error: err
  });
}

const sendErrorProd = (err, res) => {
  // operational, trusted error send message to client
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });

  // programming error or other unknown error don't leak error details
  } else {
    // 1) log error
    // eslint-disable-next-line no-console
    console.error('ERROR 💥', err);

    // 2) send generic message
    res.status(500).json({
      status: httpStatusText.ERROR,
      message: 'Something went wrong',
    });
  }
}

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || httpStatusText.ERROR;
  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === 'production') {
    let error = { ...err, name: err.name, message: err.message };
    
    // Handle known DB errors
    if (error.name === 'CastError') error = handleCastErrorDB(error);
    if (error.code === 11000) error = handleDuplicateKeysDB(error);
    if (error.name === 'ValidationError') error = handleValidationError(error);
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') error = handleJWTError(error);
    
    // production errors
    sendErrorProd(error, res);
  }
};