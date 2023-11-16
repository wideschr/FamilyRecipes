var mongoose = require("mongoose");

//define schema
var Schema = mongoose.Schema;

var categorySchema = new Schema({
    name: {type: String, required: true, unique: true},
    description: String
});

var Category = mongoose.model('Category', categorySchema);

module.exports = Category;