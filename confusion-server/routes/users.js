var express = require('express');
const bodyParser = require('body-parser');
var passport = require('passport');

var User = require('../models/user');
var authenticate = require('../authenticate');


var usersRouter = express.Router();
usersRouter.use(bodyParser.json());

/* GET users listing. */
usersRouter.get('/', authenticate.verifyUser, authenticate.verifyAdmin, function(req, res, next) {
  User.find({})
  .then(users => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json(users);
  })
  .catch(err => next(err));
});

usersRouter.post('/signup', function(req, res, next) {
  User.register(new User({username: req.body.username}), req.body.password)
  .then(user => {
    if (req.body.username) {
      user.firstname = req.body.firstname;
    }
    if (req.body.lastname) {
      user.lastname = req.body.lastname;
    }
    user.save()
    .then(_user => {
      passport.authenticate('local')(req, res, () => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json({success: true, status: 'Registration successful!'});
      })
    })
  })
  .catch(err => {
    res.statusCode = 500;
    res.setHeader('Content-Type', 'application/json');
    res.json({err: err});
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