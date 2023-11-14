var express = require('express');
var router = express.Router();
var { body, validationResult } = require('express-validator');
const multer = require('multer'); //middleware for handling multipart/form-data, which is primarily used for uploading files
const upload = multer({ dest: 'uploads/recipe-pictures' }); // 'uploads/recipe-pictures/' is the directory where the files will be saved


/* GET recipe page. */
router.get('/recipe/:id', function(req, res, next) {
  
  var recipeId = req.params.id;

  //get recipe from db based on id
  
  res.render('recipe', { recipe: '' });
});


/* GET add recipe page. */
router.get('/add', function(req, res, next) {
  res.render('addRecipe', { success: req.session.success, errors: req.session.errors });  //success set to false by default, errors set to null by default but can be filled after coming from post request

  req.session.errors = null; //reset the errors of the session after displaying them
  req.session.success = null;
});


/* POST add recipe page. */
router.post('/add', 
    
     upload.single('recipe-img'), //single file upload with name 'recipe-img'

    //first validate the data
    [
        body('title').isLength({ min: 3, max:255 }).withMessage('Title must be between 3-255 characters.').trim().matches(/^[a-z0-9 ]+$/i).withMessage('Title has invalid characters.'),
        body('author').isLength({ min: 3, max:255 }).withMessage('Title must be between 3-255 characters.').trim().matches(/^[a-z0-9 ]+$/i).withMessage('Author is invalid.'),
        body('category').isLength({ min: 3, max:255 }).withMessage('Title must be between 3-255 characters.').trim().matches(/^[a-z0-9 ]+$/i).withMessage('Category is invalid.'),
        body('time').trim().isInt({min:5, max:3600}).withMessage('Time must be a number between 5-3600.'),
        body('difficulty').isLength({ min: 3, max:255 }).withMessage('Title must be between 3-255 characters.').trim().matches(/^[a-z0-9 ]+$/i).withMessage('Difficulty is invalid.'),
        body('servings').trim().isInt({min:1, max:24}).withMessage('Servings must be a number between 1-24.'),
        body('summary').isLength({ min: 3, max:500 }).withMessage('Title must be between 3-500 characters.').trim().matches(/^[a-z0-9 ]+$/i).withMessage('Summary is invalid.'),
        body('instructions').isLength({ min: 3, max:5000 }).withMessage('Title must be between 3-5000 characters.').trim().matches(/^[a-z0-9 ]+$/i).withMessage('Instructions are invalid.'),

    ],

    //only then process request
    function(req, res, next) {
        console.log(req.file);
        console.log(req.body);

        var errors = validationResult(req);
        if (!errors.isEmpty()) { //there are errors. render form again with error messages
            req.session.errors = errors.array();
            req.session.success = false;
            res.redirect('/recipe/add');
        }
        else {
            req.session.success = true;

            //insert data into db

            res.redirect('/');
        }
    }
);

module.exports = router;
