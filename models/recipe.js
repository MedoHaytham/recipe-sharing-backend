const mongoose = require('mongoose');

const recipeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'A recipe must have a title!'],
    unique: true,
    trim: true,
    minlength: [3, 'A recipe title must be at least 3 characters long'],
    maxlength: [100, 'A recipe title must be at most 100 characters long']
  },
  img: {
    type: String,
    default: 'https://images.unsplash.com/photo-1495521821757-a1efb6729352?w=600&q=70'
  },
  desc: {
    type: String,
    required: [true, 'A recipe must have a description/desc!'],
    trim: true
  },
  category: {
    type: String,
    required: [true, 'A recipe must have a category!'],
    trim: true,
    validate: {
      validator: async function(val) {
        const categoryExists = await mongoose.model('Category').findOne({ name: val });
        return !!categoryExists;
      },
      message: 'Category "{VALUE}" does not exist. Please create the category first!'
    }
  },
  difficulty: {
    type: String,
    enum: {
      values: ['Easy', 'Medium', 'Hard'],
      message: 'Difficulty must be: Easy, Medium, or Hard'
    },
    default: 'Medium'
  },
  time: {
    type: Number,
    required: [true, 'A recipe must have a cooking/preparation time!'],
    min: [0, 'Time cannot be negative']
  },
  rating: {
    type: Number,
    default: 0,
    min: [0, 'Rating cannot be below 0'],
    max: [5, 'Rating cannot be above 5']
  },
  reviews: {
    type: Number,
    default: 0,
    min: [0, 'Reviews count cannot be negative']
  },
  ingredients: {
    type: [String],
    required: [true, 'A recipe must have ingredients!'],
    validate: {
      validator: function(val) {
        return val && val.length > 0;
      },
      message: 'A recipe must have at least one ingredient!'
    }
  },
  steps: {
    type: [String],
    required: [true, 'A recipe must have steps!'],
    validate: {
      validator: function(val) {
        return val && val.length > 0;
      },
      message: 'A recipe must have at least one step!'
    }
  },
  creator: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'A recipe must belong to a user!']
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Recipe = mongoose.model('Recipe', recipeSchema);

module.exports = Recipe;

