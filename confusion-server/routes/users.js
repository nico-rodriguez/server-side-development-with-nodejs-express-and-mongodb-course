const express = require('express');
const bodyParser = require('body-parser');
const passport = require('passport');

const User = require('../models/user');
const authenticate = require('../authenticate');
const cors = require('./cors');


const usersRouter = express.Router();
usersRouter.use(bodyParser.json());

usersRouter.options('*', cors.corsWithOptions, (req, res) => res.sendStatus(200));

/* GET users listing. */
usersRouter.get('/', cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
  User.find({})
  .then(users => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json(users);
  })
  .catch(err => next(err));
});

usersRouter.post('/signup', cors.corsWithOptions, (req, res, next) => {
  User.register(new User({username: req.body.username}), req.body.password)
  .then(user => {
    if (req.body.username)
      user.firstname = req.body.firstname;

    if (req.body.lastname)
      user.lastname = req.body.lastname;

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

usersRouter.post('/login', cors.corsWithOptions, (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err)
      return next(err);

    if (!user) {
      res.statusCode = 401;
      res.setHeader('Content-Type', 'application/json');
      return res.json({success: false, status: 'Login unsuccessful!', err: info});
    }

    req.logIn(user, err => {
      if (err) {
        res.statusCode = 401;
        res.setHeader('Content-Type', 'application/json');
        return res.json({success: false, status: 'Login unsuccessful!', err: 'Could not log in user!'});
      }

      const token = authenticate.getToken({_id: req.user._id});
  
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.json({success: true, token: token, status: 'You are successfully logged in!'});
    })
  }) (req, res, next);
});

usersRouter.get('/logout', cors.cors, (req, res, next) => {
  req.logout();
  res.redirect('/');
});

usersRouter.get('/checkJWTToken', cors.corsWithOptions, (req, res) => {
  passport.authenticate('jwt', { session: false }, (err, user, info) => {
    if (err)
      return next(err);
    
    if (!user) {
      res.statusCode = 401;
      res.setHeader('Content-Type', 'application/json');
      res.json({ status: 'JWT invalid!', success: false, err: info});
    } else {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.json({ status: 'JWT valid!', success: true, user: user});
    }
  }) (req, res);
});

module.exports = usersRouter;