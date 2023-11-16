var express = require("express");
var router = express.Router();
var {Recipe} = require('../models/Recipe.js');


/* GET home page. and show all recipes */
router.get("/", function (req, res, next) {
  Recipe.find({})
    .then(recipes=> {
      console.log(recipes)
      res.render("index", { title: "Family Recipes", recipes: recipes });
    }).catch((err)=> {
      console.log(err)
    })

});

module.exports = router;
