const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: [true, 'Please tell us your name!'],
  },
  email: {
    type: String,
    required: [true, 'Please provide a your email'],
    unique: true,
    lowercase: true,
    trim: true,
    validate: [validator.isEmail, 'Please provide a valid email'],
  },
  role: {
    type: String,
    enum: ['admin', 'lead-guide', 'guide', 'user'],
    default: 'user'
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: [8, 'a password must be at least 8 characters long'],
    trim: true,
    select: false
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Please provide a password confirm'],
    trim: true,
    // This only works on save() and create() documents not updates
    validate: {
      validator: function (val) {
        return val === this.password;
      },
      message: 'Passwords do not match'
    }
  },
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
  active: {
    type: Boolean,
    default: true,
    select: false
  }
});

userSchema.pre('save', async function () {
  if (!this.isModified('password')) return;

  // hash the password
  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;
});

userSchema.pre('save', function () {
  if (!this.isModified('password') || this.isNew) return;
  this.passwordChangedAt = Date.now() - 1000;
})

userSchema.methods.correctPassword = async function (inputPassword, userPassword) {
  return await bcrypt.compare(inputPassword, userPassword);
}

userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedPasswordTimestamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10);
    return JWTTimestamp < changedPasswordTimestamp
  }
  return false;
}

userSchema.methods.createPasswordResetToken = function () {
  const restToken = crypto.randomBytes(32).toString('hex');
  this.passwordResetToken = crypto.createHash('sha256').update(restToken).digest('hex');
  this.passwordResetExpires = Date.now() + 10 * 1000 * 60;
  return restToken;
}

userSchema.pre(/^find/, function () {
  this.find({ active: { $ne: false } });
});

const user = mongoose.model('User', userSchema);
module.exports = user;