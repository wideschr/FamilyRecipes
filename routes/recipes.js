var express = require("express");
var router = express.Router();
var { body, validationResult } = require("express-validator");
const multer = require("multer"); //middleware for handling multipart/form-data, which is primarily used for uploading files
const upload = multer({ dest: "uploads/recipe-pictures" }); // 'uploads/recipe-pictures/' is the directory where the files will be saved
var Recipe = require("../models/Recipe.js");
var Category = require("../models/Category.js");

/* GET add recipe page. */
router.get("/add", function (req, res, next) {
  //get categories from db to add them to the dropdown menu
  var categories = Category.find({}).then((categories) => {
    console.log(categories);

    //render the form
    res.render("addRecipe", {
      title: "Add recipe",
      categories: categories,

      success: req.session.success, //success set to false by default, errors set to null by default but can be filled after coming from post request
      errors: req.session.errors,
    });

    req.session.errors = null; //reset the errors of the session after displaying them
    req.session.success = null;
  });
});

/* POST add recipe page. */
router.post("/add",

  upload.single("recipe-img"), //single file upload with name 'recipe-img'

  //first validate the data
  [
    body("title")
      .isLength({ min: 3, max: 255 })
      .withMessage("Title must be between 3-255 characters.")
      .trim()
      .matches(/^[a-z0-9 .,!]+$/i)
      .withMessage("Title has invalid characters."),
    body("author")
      .isLength({ min: 3, max: 255 })
      .withMessage("Author must be between 3-255 characters.")
      .trim()
      .matches(/^[a-z0-9 ]+$/i)
      .withMessage("Author is invalid."),
    body("email")
      .isEmail()
      .withMessage("Email is invalid.")
      .trim()
      .normalizeEmail(),
    body("category")
      .isLength({ min: 3, max: 255 })
      .withMessage("Category must be between 3-255 characters.")
      .trim()
      .matches(/^[a-z0-9 ]+$/i)
      .withMessage("Category is invalid."),
    body("time")
      .trim()
      .isInt({ min: 5, max: 3600 })
      .withMessage("Time must be a number between 5-3600."),
    body("difficulty")
      .isLength({ min: 3, max: 255 })
      .withMessage("Difficulty must be between 3-255 characters.")
      .trim()
      .matches(/^[a-z0-9 .,!]+$/i)
      .withMessage("Difficulty is invalid."),
    body("servings")
      .trim()
      .isInt({ min: 1, max: 24 })
      .withMessage("Servings must be a number between 1-24."),
    body("summary")
      .isLength({ min: 3, max: 5000 })
      .withMessage("summary must be between 3-500 characters.")
      .trim()
      .matches(/^[a-z0-9 .,!\n]+$/i)
      .withMessage("Summary is invalid."),
    body("instructions")
      .isLength({ min: 3, max: 50000 })
      .withMessage("instructions must be between 3-50000 characters."),
  ],

  //only then process request
  function (req, res, next) {
    //collect the errors from the validation
    var errors = validationResult(req);
    if (!errors.isEmpty()) {
      //there are errors. render form again with error messages
      req.session.errors = errors.array();
      req.session.success = false;
      res.redirect("/recipe/add");
    } else {
      req.session.success = true;

      //combine the ingredients and amounts into array of objects
      var ingredients = req.body.ingredients;
      var amounts = req.body.amounts;
      var ingredientsObjects = ingredients.map((ingredient, index) => {
        return { name: ingredient, quantity: amounts[index] };
      });

      //build path to picture
      var picturePath = req.file
        ? req.protocol +
          "://" +
          req.hostname +
          ":" +
          (req.app.settings.port || process.env.PORT) +
          "/" +
          req.file.path.replace(/\\/g, "/")
        : undefined;

      //insert data into db
      var recipe = {
        title: req.body.title,
        ingredients: ingredientsObjects,
        prepTimeInMinutes: req.body.time,
        summary: req.body.summary,
        instructions: req.body.instructions,
        category: req.body.category,
        picture_url: req.file ? picturePath : undefined,
        difficulty: req.body.difficulty,
        servings: req.body.servings,
        author: { name: req.body.author, email: req.body.email },
      };

      try {
        var newRecipe = new Recipe(recipe);
        newRecipe.save();

        req.session.success = true;
        res.redirect("/recipe/" + newRecipe._id);
      } catch (error) {
        req.session.errors = error;
        req.session.success = false;
      }
    }
  }
);




/* Update recipe page. */
router.get("/update/:id", function (req, res, next) {
  // Get the categories from the database
  Category.find({}).then((categories) => {
    // After categories are fetched, find the recipe
    Recipe.findById(req.params.id).then((recipe) => {
      // After the recipe is fetched, render the view
      res.render("updateRecipe", {
        recipe: recipe,
        title: "Edit recipe",
        categories: categories,
      });
    });
  });
});

router.put("/update/:id",

  //get the file from the form
  upload.single("recipe-img"), //single file upload with name 'recipe-img'
    
  //first validate the data
  [
    body("title")
      .isLength({ min: 3, max: 255 })
      .withMessage("Title must be between 3-255 characters.")
      .trim()
      .matches(/^[a-z0-9 .,!]+$/i)
      .withMessage("Title has invalid characters."),
    body("author")
      .isLength({ min: 3, max: 255 })
      .withMessage("Author must be between 3-255 characters.")
      .trim()
      .matches(/^[a-z0-9 ]+$/i)
      .withMessage("Author is invalid."),
    body("email")
      .isEmail()
      .withMessage("Email is invalid.")
      .trim()
      .normalizeEmail(),
    body("category")
      .isLength({ min: 3, max: 255 })
      .withMessage("Category must be between 3-255 characters.")
      .trim()
      .matches(/^[a-z0-9 ]+$/i)
      .withMessage("Category is invalid."),
    body("time")
      .trim()
      .isInt({ min: 5, max: 3600 })
      .withMessage("Time must be a number between 5-3600."),
    body("difficulty")
      .isLength({ min: 3, max: 255 })
      .withMessage("Difficulty must be between 3-255 characters.")
      .trim()
      .matches(/^[a-z0-9 .,!]+$/i)
      .withMessage("Difficulty is invalid."),
    body("servings")
      .trim()
      .isInt({ min: 1, max: 24 })
      .withMessage("Servings must be a number between 1-24."),
    body("summary")
      .isLength({ min: 3, max: 5000 })
      .withMessage("summary must be between 3-500 characters.")
      .trim()
      .matches(/^[a-z0-9 .,!\n]+$/i)
      .withMessage("Summary is invalid."),
    body("instructions")
      .isLength({ min: 3, max: 50000 })
      .withMessage("instructions must be between 3-50000 characters."),
  ],
  
  //only then process request
  function (req, res, next) {
    
    var recipeId = req.params.id;
    
    //collect the errors from the validation
    var errors = validationResult(req);

    if (!errors.isEmpty()) { //there are errors. render form again with error messages
        req.session.errors = errors.array();
        req.session.success = false;
        res.redirect("/recipe/update/" + recipeId);
    } else {
        console.log('hallo');
    }
    
  }
);

/* Delete recipe page. */
router.get("/delete/:id", function (req, res, next) {
  var recipeId = req.params.id;

  //delete recipe from db based on id
  try {
    Recipe.findByIdAndDelete(recipeId).exec();
    res.redirect("/");
  } catch (error) {
    console.log(error);
    redirect("/recipe/" + recipeId);
  }  
});

/* GET individual recipe page. */
router.get("/:id", function (req, res, next) {
  //get id from url
  var recipeId = req.params.id;

  var recipe = Recipe.findById(recipeId)
  .then((recipe) => {
    // Sort comments in descending order by 'published_on'
    recipe.comments.sort((a, b) => new Date(b.published_on) - new Date(a.published_on));
    
    res.render("recipe", { recipe: recipe, title: recipe.title });
  })
  .catch((err) => {
    console.log(err);
  });

});

module.exports = router;
