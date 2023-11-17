var express = require("express");
var router = express.Router();
var Recipe = require('../models/Recipe.js');


/* GET home page. and show all recipes */
router.get("/", function (req, res, next) {
  Recipe.find({})
    .then(recipes=> {
      res.render("index", { title: "Family Recipes", recipes: recipes });
    }).catch((err)=> {
      console.log(err)
    })
});


/* GET search results. */
router.get("/search", function (req, res, next) {
  
  var query = req.query.q; // Get the query from the request
  
  Recipe.find({
    $or: [
      { title: { $regex: new RegExp(query), $options: 'i' } },
      { category: { $regex: new RegExp(query), $options: 'i' } },
      { summary: { $regex: new RegExp(query), $options: 'i' } },
      { instructions: { $regex: new RegExp(query), $options: 'i' } },
      { difficulty: { $regex: new RegExp(query), $options: 'i' } },

    ]
  }) // Find recipes with a title or category that matches the query
    .then((recipes) => {
      if (recipes.length == 0) {
        req.session.success = false;
        req.session.errors = [{ msg: "No recipes found with this query. Try again or add a new recipe." }];
        res.render("index", {
          recipes: recipes, success: req.session.success, errors: req.session.errors
        });

        req.session.errors = null; //reset the errors of the session after displaying them
        req.session.success = null;
      } else {
        req.session.success = true;
        res.render("index", {
          recipes: recipes, success: req.session.success
        });
        
        req.session.errors = null; //reset the errors of the session after displaying them
        req.session.success = null;
      }

    })
    .catch((err) => {
      console.log(err);
    });
});

module.exports = router;
