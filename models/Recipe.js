//require mongoose and make connection to db
var mongoose = require("mongoose");
mongoose.connect("mongodb+srv://sct:azertyuiop@familyrecipes.obygc6x.mongodb.net/familyrecipes?retryWrites=true&w=majority")
  .then(() => console.log('Database connected successfully'))
  .catch(err => console.error('Database connection error: ', err));;

//define schema
var Schema = mongoose.Schema;

const ingredientSchema = new Schema({
  name: String,
  quantity: Schema.Types.Mixed
});

const commentSchema = new Schema({
  name: String,
  message: String,
  published_on: Date
});

const authorSchema = new Schema({
  name: String,
  email: String,
});

const recipeSchema = new Schema({
  title: String,
  ingredients: [ingredientSchema],
  prepTimeInMinutes: Number,
  summary: String,
  instructions: String,
  category: String,
  picture_url: String,
  difficulty: String,
  servings: Number,
  author: authorSchema,
  comments: [commentSchema]
}, { collection: 'recipes' }); //specify collection name to avoid pluralization of model name

var Recipe = mongoose.model('Recipe', recipeSchema); //create model from schema


module.exports = Recipe;