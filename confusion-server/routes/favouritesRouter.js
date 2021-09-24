const bodyParser = require('body-parser');
const express = require('express');
const mongoose = require('mongoose');

const authenticate = require('../authenticate');
const cors = require('./cors');
const Dishes = require('../models/dishes');
const Favourites = require('../models/favourite');

const favouritesRouter = express.Router();

favouritesRouter.use(bodyParser.json());

const dishExists = async dishId => {
  try {
    const dish = await Dishes.findById(dishId);
    return dish != null;
  } catch (err) {
    console.error(err);
  }
};

favouritesRouter.route('/')
  .options(cors.corsWithOptions, (req, res) => { res.sendStatus(200) })
  .post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    const dishesIds = req.body.reduce(
      (prev, act) => {
        prev.push(act._id);
        return prev;
      }, []
    )

    Favourites.findOneAndUpdate({ user: req.user._id }, {
        $addToSet: { dishes: { $each: dishesIds } }
    })
    .then(favourites => {
      if (favourites != null) {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(favourites);
      } else {
        Favourites.create({ user: req.user._id, dishes: dishesIds })
        .then(favouritesCreated => {
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.json(favouritesCreated);
        })
      }
    })
    .catch(err => next(err));
  })
  .put(cors.corsWithOptions, authenticate.verifyUser, (req, res) => {
    res.statusCode = 405;
    res.end('PUT operation not supported on /favourites');
  })
  .get(cors.cors, authenticate.verifyUser, (req, res, next) => {
    Favourites.findOne({
        user: req.user._id
      })
    .populate('user')
    .populate('dishes')
    .then(favourites => {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.json(favourites);
    })
    .catch (err => next(err));
  })
  .delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favourites.updateOne({ user: req.user._id }, { $set: { dishes: [] }})
    .then(resp => {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.json(resp);
    })
    .catch(err => next(err));
  });

favouritesRouter.route('/:dishId')
  .options(cors.corsWithOptions, (req, res) => { res.sendStatus(200) })
  .post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    dishExists(req.params.dishId)
    .then(dishExists => {
      if (dishExists) {
        Favourites.updateOne({ user: req.user._id },
          { $addToSet: { dishes: req.params.dishId } })
        .then(favourites => {
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.json(favourites);
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
    res.end(`PUT operation not supported on /favourites/${req.params.dishId}`);
  })
  .get(cors.cors, authenticate.verifyUser, (req, res, next) => {
    Favourites.findOne({ user: req.user._id, dishes: req.params.dishId })
    .populate('user')
    .populate('dishes')
    .then(favourites => {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.json(favourites);
    })
    .catch(err => next(err));
  })
  .delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favourites.updateOne({ user: req.user._id }, { $pull: { dishes: req.params.dishId }})
    .then(resp => {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.json(resp);
    })
    .catch(err => next(err));
  });

  module.exports = favouritesRouter;