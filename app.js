var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var expressSession=require('express-session');
const bodyParser = require('body-parser');
const methodOverride = require('method-override'); //needed for PUT and DELETE requests
const env = require('dotenv').config(); //needed for .env file


//require mongoose and make connection to db (better to make connection here I think, otherwise i have to do it in each model)
var mongoose = require("mongoose");
mongoose.connect(`mongodb+srv://${process.env.MDB_USER}:${process.env.MDB_PASSWORD}@familyrecipes.obygc6x.mongodb.net/FamilyRecipes?retryWrites=true&w=majority`)
  .then(() => console.log('Database connected successfully'))
  .catch(err => console.error('Database connection error: ', err));

//the section below is needed for file upload
const multer = require('multer');
const mime = require('mime-types');
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, 'uploads/recipe-pictures');
  },
  filename: function(req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + '.' + mime.extension(file.mimetype));
  }
});
const upload = multer({ storage: storage });

//routers
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var recipeRouter = require('./routes/recipes');
var commentsRouter = require('./routes/comments');
var aboutRouter = require('./routes/about');

//start express
var app = express();


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
// Set up express-handlebars
var hbs = require('express-handlebars').create({
  defaultLayout: '../layout',
  extname: '.hbs',
  partialsDir: [
    // Path to your partials
    path.join(__dirname, 'views/partials'),
  ],
  runtimeOptions: {
    allowProtoPropertiesByDefault: true
  }
});

app.engine('hbs', hbs.engine);

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(methodOverride('_method'));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public'))); //needed to access files in public directory
app.use('/uploads/recipe-pictures', express.static(path.join(__dirname, 'uploads', 'recipe-pictures'))); //needed to access pictures/files in uploads directory
app.use(expressSession({secret:'max', saveUninitialized:false, resave:false})); //needed for session.success and session.errors


app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/recipe', recipeRouter);
app.use('/comments', commentsRouter);
app.use('/about', aboutRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
