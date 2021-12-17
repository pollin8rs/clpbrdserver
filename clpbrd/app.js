var createError = require('http-errors');
var express = require('express');
var session = require("express-session");
var mongoose = require('mongoose');
const MongoStore = require("connect-mongo");

var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var passport = require('passport');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var authRouter = require("./routes/auth");

// Compression middleware
var compression = require('compression');
var helmet = require('helmet');
var app = express();

// Set up mongoose connection
var dev_db_url = 'mongodb+srv://clpbrdmongo:Run4cov3r@clpbrd0.p6pso.mongodb.net/clpbrd';
// var dev_db_url = 'mongodb://localhost:27017/local_library';
var mongodb = process.env.MONGODB_URI || dev_db_url;
mongoose.connect(mongodb, { useNewUrlParser: true, useUnifiedTopology: true});
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));




// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(compression()); //Compress all routes
app.use(helmet());

app.use(express.static(path.join(__dirname, 'public')));


// Express Session
app.use(
  session({
      secret: "very secret this is",
      resave: false,
      saveUninitialized: true,
      store: new MongoStore({ mongoUrl: dev_db_url })
  })
);

// Passport setup
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use('/', indexRouter);
app.use("/api/auth", authRouter);
app.use('/users', usersRouter);

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
