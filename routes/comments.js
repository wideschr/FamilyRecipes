var express = require("express");
var router = express.Router();
var { body, validationResult } = require("express-validator");
const multer = require("multer"); //middleware for handling multipart/form-data, which is primarily used for uploading files
const upload = multer({ dest: "uploads/recipe-pictures" }); // 'uploads/recipe-pictures/' is the directory where the files will be saved
var Recipe = require("../models/Recipe.js");
var Category = require("../models/Category.js");
const { ObjectId } = require("mongodb");

/* POST comment. */
router.post("/add/:id",

    //first validate the data
    [
        body("name")
            .isLength({ min: 3, max: 255 })
            .withMessage("Name must be between 3-255 characters.")
            .trim()
            .matches(/^[a-z0-9 ]+$/i)
            .withMessage("Name is invalid."),
        body("message")
            .isLength({ min: 3, max: 255 })
            .withMessage("Message must be between 3-255 characters.")
            .trim()
            .matches(/^[a-z0-9 .,!]+$/i)
            .withMessage("Message has invalid characters."),
    ],

    function (req, res, next) {
        var recipeId = req.params.id;
        //check if there are errors
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            //there are errors
            req.session.errors = errors.array();
            req.session.success = false;
            res.redirect("/recipe/" + recipeId);
        } else {
            req.success = true;

            //create comment object
            var comment = {
                name: req.body.name,
                message: req.body.message,
                published_on: new Date()
            };

            //try updating the recipe with the new comment
            try {
                // Update the recipe with the new comment
                Recipe.findByIdAndUpdate(req.params.id, { $push: { comments: comment } }, { new: true })
                    .then(updatedRecipe => {
                        console.log("finalised");
                        res.redirect("/recipe/" + recipeId);
                    })
                    .catch(err => {
                        console.log(err);
                    });
            } catch (error) {
                console.log(error);
            }

        }


        //get the recipe from db
        var recipe = Recipe.findById(req.params.id)
            .then((recipe) => { });


    });


/* UPDATE comment */
//render the view to update the comment
router.get("/update/:id", function (req, res, next) {
    // Get the comment ID from the URL
    var commentId = new ObjectId(req.params.id);

    //get the recipe that contains the comment
    Recipe.findOne({ 'comments._id': commentId })
        .then((recipe) => {
            //sort the comments
            recipe.comments.sort((a, b) => new Date(b.published_on) - new Date(a.published_on));
            // Find the comment in the recipe
            var comment = recipe.comments.find((comment) => comment._id.equals(commentId));
            // Render the update comment view
            res.render("updateComment", { recipe:recipe, comment: comment, title: "Update Comment" });
        })
        .catch((err) => {
            console.log(err);
        });
});

// update the comment
router.post("/update/:id", 
    //validate the data
    [
        body("message")
            .isLength({ min: 3, max: 255 })
            .withMessage("Message must be between 3-255 characters.")
            .matches(/^[a-z0-9 .,!\n]+$/i)
            .withMessage("Summary is invalid."),
    ],

    function (req, res, next) {
        // Get the comment ID from the URL
        var commentId = new ObjectId(req.params.id);
        console.log(commentId);
        //get the errors
        const errors = validationResult(req);

        //get the recipe
        Recipe.findOne({ 'comments._id': commentId })
        .then((recipe) => {
            //sort the comments
            recipe.comments.sort((a, b) => new Date(b.published_on) - new Date(a.published_on));
            // Find the comment in the recipe
            var comment = recipe.comments.find((comment) => comment._id.equals(commentId));
            
            if(!errors.isEmpty()) {
                //there are errors
                req.session.errors = errors.array();
                req.session.success = false;
                res.render("updateComment", { recipe:recipe, comment: comment, title: "Update Comment", errors: req.session.errors });
            } else {
                // No errors, update the comment
                comment.message = req.body.message;
                comment.published_on = new Date();
                recipe.save()
                .then(() => {
                    req.session.success = true;
                    // render  the recipe page with success message
                    res.render("recipe", { recipe:recipe, comment: comment, title: "Update Comment", succes: req.session.success });
                })
                .catch((err) => {
                    console.log(err);
                });
            }
        })
        .catch((err) => {
            console.log(err);
        });
});



/* DELETE comment */
router.post("/delete/:id", function (req, res, next) {
    // Get the comment ID from the URL
    var commentId = new ObjectId(req.params.id);

    // Find the recipe that contains the comment
    Recipe.findOne({ 'comments._id': commentId })
        .then((recipe) => {
            // Update recipe and pull comment --> need to return because otherwise i would not be able to haveupdatedRecep in the next then
            return Recipe.findByIdAndUpdate(recipe._id, {
                $pull: { comments: { _id: commentId } }
            }, { new: true });
        })
        .then((updatedRecipe) => {
            // Redirect to the recipe page
            res.redirect("/recipe/" + updatedRecipe._id);
        })
        .catch((err) => {
            console.log(err);
        });
});


module.exports = router;
