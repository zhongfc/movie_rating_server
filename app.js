var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var cors = require('cors');
var morgan = require('morgan');
var fs = require('fs');
var logger = require('morgan');
var jwt = require('jsonwebtoken');
var passport = require('passport');
var passportJWT = require('passport-jwt');
const User = require('./models/User.js')

var ExtractJwt = passportJWT.ExtractJwt;
var JwtStrategy = passportJWT.Strategy;
var jwtOptions = {};
jwtOptions.jwtFromRequest = ExtractJwt.fromAuthHeaderWithScheme('jwt');
jwtOptions.secretOrKey = 'thisisthesecretkey';

var strategy = new JwtStrategy(jwtOptions, function(jwt_payload, next) {
  console.log('payload received', jwt_payload);
  // usually this would be a database call:
  User.findById(jwt_payload.id)
            .then(user =>{
            	if(user){
            		return next(null,user);
            	}
            	  return next(null,false);
            })
            .catch(err => console.log(err));
});

passport.use(strategy);


var app = express();

const router = express.Router();

app.use(morgan('combined'));
app.use(bodyParser.json());
app.use(cors());
app.use(passport.initialize());


fs.readdirSync('controllers').forEach(file => {
  if(file.substr(-3) == '.js'){
    const route = require('./controllers/'+file);
    route.controller(app);
  }
});

mongoose.connect('mongodb://10.10.10.131:27017/movie_rating_app',()=>{
  console.log('Connection has been made');
})
.catch(err=>{
  console.error('App starting error:'+err.stack);
  process.exit(1);
})

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

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

app.listen(3000,()=>{console.log('listening on 3000')});

module.exports = app;
