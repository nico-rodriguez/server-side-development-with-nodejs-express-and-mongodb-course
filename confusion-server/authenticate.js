var passport = require('passport');
var User = require('./models/user');
var JwtStrategy = require('passport-jwt').Strategy;
var ExtractJwt = require('passport-jwt').ExtractJwt;
var jwt = require('jsonwebtoken');

var config = require('./config');


passport.use(User.createStrategy());

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

exports.getToken = user => {
  return jwt.sign(user, config.secretKey, {
    expiresIn: 3600
  });
};

var opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = config.secretKey;

exports.jwtPassport = passport.use(new JwtStrategy(opts, (payload, done) => {
  console.log(`JWT payload ${payload}`);
  User.findOne({_id: payload._id})
  .then(user => {
    if (user) {
      return done(null, user);
    } else {
      return done(null, false);
    }
  })
  .catch(err => done(err, false));
}));

exports.verifyUser = passport.authenticate('jwt', {session: false});

exports.verifyAdmin = (req, _res, next) => {
  if (req.user != null) {
    if (req.user.admin === true) {
      next();
    } else {
      const err = new Error('You are not authorized to perform this operation!');
      err.status = 403;
      return next(err);
    }
  } else {
    const err = new Error('You must log in first!');
      err.status = 403;
      return next(err);
  }
};