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
    default: "🌐",
    trim: true
  },
  img: {
    type: String,
    default: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=2070&auto=format&fit=crop",
    trim: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Category = mongoose.model('Category', categorySchema);

module.exports = Category;
