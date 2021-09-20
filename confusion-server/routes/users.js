const express = require('express');
const bodyParser = require('body-parser');
const passport = require('passport');

const User = require('../models/user');
const authenticate = require('../authenticate');
const cors = require('./cors');


const usersRouter = express.Router();
usersRouter.use(bodyParser.json());

usersRouter.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200) });

/* GET users listing. */
usersRouter.get('/', cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, function(req, res, next) {
  User.find({})
  .then(users => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json(users);
  })
  .catch(err => next(err));
});

usersRouter.post('/signup', cors.corsWithOptions, function(req, res, next) {
  User.register(new User({username: req.body.username}), req.body.password)
  .then(user => {
    if (req.body.username) {
      user.firstname = req.body.firstname;
    }
    if (req.body.lastname) {
      user.lastname = req.body.lastname;
    }
    user.save()
    .then(user => {
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

usersRouter.post('/login', cors.corsWithOptions, passport.authenticate('local'), function(req, res) {
  const token = authenticate.getToken({_id: req.user._id});

  console.log(token);
  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json');
  res.json({success: true, token: token, status: 'You are successfully logged in!'});
});

usersRouter.get('/logout', cors.cors, function(req, res, next) {
  req.logout();
  res.redirect('/');
});

module.exports = usersRouter;