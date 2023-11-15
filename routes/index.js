var express = require("express");
var router = express.Router();
const { connectToDb, client } = require("../mongoDb_driver.js");

/* GET home page. and show all recipes */
router.get("/", function (req, res, next) {
  console.log("Attempting to connect to DB");
  //make connection to db with funtion defined in driver
  connectToDb()
    .then(() => {

      //get all recipes from db
      client
        .db("FamilyRecipes")  //db name
        .collection("recipes")  //collection name
        .find() //find all documents
        .toArray()  //convert to array
        .then((recipes) => {  //recipes is the array of documents

          res.render("index", { recipes: recipes, title:"Overview" });  //pass the array of documents to the view
        })
        .catch(console.error);
      
    })
    .catch(console.error);
});

module.exports = router;
