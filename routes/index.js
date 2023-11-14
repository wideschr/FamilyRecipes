var express = require('express');
var router = express.Router();

/* GET home page. and show all recipes */
router.get('/', function(req, res, next) {

  //get recipes from db
  
  //render view and send data
  res.render('index', { recipes: '' });
});

module.exports = router;
