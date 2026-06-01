const jwt = require('jsonwebtoken')
const { promisify } = require('util');
const asyncWrapper = require('../utils/asyncWrapper');
const AppError = require('../utils/appError');
const User = require('../models/users');

exports.verifyToken = asyncWrapper( 
  async (req, res, next) => {
    // 1) check if authHeader exist and start with Bearer
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return next(new AppError('Token is required', 401));
    }

    // 2) get token from authHeader and check if token exist
    const token = authHeader.split(' ')[1];
  
    if ( !token ) {
      return next( new AppError('Token is not found', 401) );
    };

    // 3) verify token
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

    // 4) check if user is not exist 
    const currentUser = await User.findById(decoded.id);
    if( !currentUser ) {
      return next(new AppError('The user that belong to this token does not exist', 401));
    };

    // 5) check if user changed his password after the token was issued
    if (currentUser.changedPasswordAfter(decoded.iat)) {
      return next(new AppError('User changed his password, please login again', 401));
    };

    req.currentUser = currentUser;
    next();
  }
);

