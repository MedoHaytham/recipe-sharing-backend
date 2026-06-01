const User = require('../models/users');
const asyncWrapper = require('../utils/asyncWrapper');
const AppError = require('../utils/appError');
const httpStatus = require('../utils/httpStatusText');
const factory = require('./handlerFactory');

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach(el => {
    if(allowedFields.includes(el)) newObj[el] = obj[el];
  })
  return newObj;
};

// admin only handlers
exports.getAllUsers = factory.getAll(User);
exports.getUser = factory.getOne(User);
exports.updateUser = factory.updateOne(User);
exports.deleteUser = factory.deleteOne(User);

// self update handlers
exports.updateMe = asyncWrapper(
  async (req, res, next) => {

    // 1) create error if user tries to update password
    if( req.body.password || req.body.passwordConfirm ){
      return next(new AppError('You cannot update your password here! Use /updateMyPassword instead.', 400));
    }
    
    //2) filter out unwanted fields names that are not allowed to be updated
    const filteredBody = filterObj(req.body, 'name', 'email');

    // 3) update user document
    const { _id } = req.currentUser;

    const updatedUser = await User.findByIdAndUpdate( _id, filteredBody, {
      new: true, 
      runValidators: true
    });

    res.status(200).json({
      status: httpStatus.SUCCESS,
      data: {
        user: updatedUser,
      }
    });
  }
);

exports.deleteMe = asyncWrapper(
  async (req, res, next) => {
    await User.findByIdAndUpdate(req.currentUser.id, {active: false});
    
    res.status(204).json({
      status: httpStatus.SUCCESS,
      data: null
    });
  }
);

// middleware to get current user
exports.getMe = (req, res, next) => {
  req.params.id = req.currentUser._id;
  next();
}