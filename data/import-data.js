const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Recipe = require('../models/recipe');
const Category = require('../models/category');

dotenv.config({ path: './config.env' })

const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);

mongoose.connect(DB).then(() => {
  console.log('connected to mongodb');
})

const recipes = JSON.parse(fs.readFileSync(`${__dirname}/recipes.json`, 'utf-8'));
const categories = JSON.parse(fs.readFileSync(`${__dirname}/categories.json`, 'utf-8'));


const importData = async () => {
  try {
    await Category.create(categories);
    await Recipe.create(recipes);
    console.log('Data imported successfully');
  } catch (error) {
    console.log(error);
  }
  process.exit();
}

const deleteData = async () => {
  try {
    await Category.deleteMany();
    await Recipe.deleteMany();
    console.log('Data deleted successfully');
  } catch (error) {
    console.log(error);
  }
  process.exit();
}


if (process.argv[2] === '--import') {
  importData();
}

if (process.argv[2] === '--delete') {
  deleteData();
}