var express = require('express');
const bodyParser = require('body-parser');
var passport = require('passport');

var User = require('../models/user');
var authenticate = require('../authenticate');


var usersRouter = express.Router();
usersRouter.use(bodyParser.json());

/* GET users listing. */
usersRouter.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

usersRouter.post('/signup', function(req, res, next) {
  User.register(new User({username: req.body.username}), req.body.password,
    (err, user) => {
    if (err) {
      res.statusCode = 500;
      res.setHeader('Content-Type', 'application/json');
      res.json({err: err});
    } else {
      passport.authenticate('local')(req, res, () => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json({success: true, status: 'Registration successful!'});
      })
    }
  });
});

usersRouter.post('/login', passport.authenticate('local'), function(req, res) {
  var token = authenticate.getToken({_id: req.user._id});

  console.log(token);
  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json');
  res.json({success: true, token: token, status: 'You are successfully logged in!'});
});

usersRouter.get('/logout', function(req, res, next) {
  req.logout();
  res.redirect('/');
});

module.exports = usersRouter;