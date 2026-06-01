const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A category must have a name!'],
    unique: true,
    trim: true,
    minlength: [3, 'A category name must be at least 3 characters long'],
    maxlength: [50, 'A category name must be at most 50 characters long']
  },
  emoji: {
    type: String,
    required: [true, 'A category must have an emoji!'],
    trim: true
  },
  img: {
    type: String,
    required: [true, 'A category must have an image link!'],
    trim: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Category = mongoose.model('Category', categorySchema);

module.exports = Category;
