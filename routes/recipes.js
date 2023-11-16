var express = require("express");
var router = express.Router();
var { body, validationResult } = require("express-validator");
const multer = require("multer"); //middleware for handling multipart/form-data, which is primarily used for uploading files
const upload = multer({ dest: "uploads/recipe-pictures" }); // 'uploads/recipe-pictures/' is the directory where the files will be saved
var Recipe = require("../models/Recipe.js");

/* GET add recipe page. */
router.get("/add", function (req, res, next) {
  res.render("addRecipe", {
    success: req.session.success,
    errors: req.session.errors,
    title: "Add recipe",
  }); //success set to false by default, errors set to null by default but can be filled after coming from post request

  req.session.errors = null; //reset the errors of the session after displaying them
  req.session.success = null;
});

/* POST add recipe page. */
router.post(
  "/add",

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
      .withMessage("instructions must be between 3-50000 characters.")
  ],

  //only then process request
  function (req, res, next) {
    console.log(req.file);
    console.log(req.body);

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

      console.log(req)
      //build path to picture
        var picturePath = req.file ? req.protocol + "://" + req.hostname +':' + (req.app.settings.port || process.env.PORT) +'/' + req.file.path.replace(/\\/g, '/') : undefined;

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
        author:{name: req.body.author, email: req.body.email},
      };

      connectToDb()
        .then(() => {
            //access the collection
            client.db("FamilyRecipes")
                .collection("recipes")
                .insertOne(recipe)
                .then((result, err) => {
                    console.log(`A document was inserted with the _id: ${result.insertedId}`);
                    client.close();
                    console.log("db connection closed");
                    console.log(err);
                    res.redirect("/recipe/"+result.insertedId);
                })
        })
    }
  }
);

/* Update recipe page. */
router.put("/update/:id", function (req, res, next) {
  var recipeId = req.params.id;

  //update recipe in db based on id

  res.render("recipe", { recipe: "" });
});

/* Delete recipe page. */
router.delete("/delete/:id", function (req, res, next) {
  var recipeId = req.params.id;

  //delete recipe from db based on id

  res.render("index", { title: "Edit recipe" });
});

/* GET individual recipe page. */
router.get("/:id", function (req, res, next) {
  //get id from url 
  var recipeId = req.params.id;

    var recipe = Recipe.findById(recipeId)
    console.log(recipe)
  res.render("recipe", { recipe: recipe, title: recipe.title }); //pass the document to the view
});

module.exports = router;
