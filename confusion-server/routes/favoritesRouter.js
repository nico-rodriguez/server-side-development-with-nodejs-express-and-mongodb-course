const bodyParser = require('body-parser');
const express = require('express');
const mongoose = require('mongoose');

const authenticate = require('../authenticate');
const cors = require('./cors');
const Dishes = require('../models/dishes');
const Favorites = require('../models/favorite');

const favoritesRouter = express.Router();

favoritesRouter.use(bodyParser.json());

const dishExists = async dishId => {
  try {
    const dish = await Dishes.findById(dishId);
    return dish != null;
  } catch (err) {
    console.error(err);
  }
};

favoritesRouter.route('/')
  .options(cors.corsWithOptions, (req, res) => { res.sendStatus(200) })
  .post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    const dishesIds = req.body.reduce(
      (prev, act) => {
        prev.push(act._id);
        return prev;
      }, []
    )
    console.log(dishesIds);

    Favorites.findOneAndUpdate({ user: req.user._id }, {
        $addToSet: { dishes: { $each: dishesIds } }
    })
    .populate('user')
    .populate('dishes')
    .then(favorites => {
      if (favorites != null) {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(favorites);
      } else {
        Favorites.create({ user: req.user._id, dishes: dishesIds })
        .then(favoritesCreated => {
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.json(favoritesCreated);
        })
      }
    })
    .catch(err => next(err));
  })
  .put(cors.corsWithOptions, authenticate.verifyUser, (req, res) => {
    res.statusCode = 405;
    res.end('PUT operation not supported on /favorites');
  })
  .get(cors.cors, authenticate.verifyUser, (req, res, next) => {
    Favorites.findOne({
        user: req.user._id
      })
    .populate('user')
    .populate('dishes')
    .then(favorites => {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.json(favorites);
    })
    .catch (err => next(err));
  })
  .delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorites.updateOne({ user: req.user._id }, { $set: { dishes: [] }})
    .then(resp => {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.json(resp);
    })
    .catch(err => next(err));
  });

favoritesRouter.route('/:dishId')
  .options(cors.corsWithOptions, (req, res) => { res.sendStatus(200) })
  .post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    dishExists(req.params.dishId)
    .then(dishExists => {
      if (dishExists) {
        Favorites.updateOne({ user: req.user._id },
          { $addToSet: { dishes: req.params.dishId } })
        .then(favorites => {
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.json(favorites);
        })
      } else {
        const err = new Error(`There is no dish with id ${req.params.dishId}`);
        err.status = 404;
        return next(err);
      }
    })
    .catch (err => next(err));
  })
  .put(cors.corsWithOptions, authenticate.verifyUser, (req, res) => {
    res.statusCode = 405;
    res.end(`PUT operation not supported on /favorites/${req.params.dishId}`);
  })
  .get(cors.cors, authenticate.verifyUser, (req, res, next) => {
    Favorites.findOne({ user: req.user._id , dishes: { $in: [req.params.dishId] } })
    .populate('user')
    .populate('dishes')
    .then(favorites => {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');

      if (favorites) {
        res.json({"exists": true, "favorites": favorites});
      } else {
        res.json({"exists": false, "favorites": favorites});
      }
    })
    .catch(err => next(err));
  })
  .delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorites.findOneAndUpdate({ user: req.user._id }, { $pull: { dishes: req.params.dishId }}, {new: true})
    .populate('user')
    .populate('dishes')
    .then(resp => {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.json(resp);
    })
    .catch(err => next(err));
  });

  module.exports = favoritesRouter;