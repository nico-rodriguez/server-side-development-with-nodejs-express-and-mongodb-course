const bodyParser = require('body-parser');
const express = require('express');

const authenticate = require('../authenticate');
const Promotions = require('../models/promotions');

const promoRouter = express.Router();

promoRouter.use(bodyParser.json());

promoRouter.route('/')
  .get((req, res, next) =>{
    Promotions.find({})
    .then(promotions => {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.json(promotions);
    })
    .catch(err => next(err));
  })
  .post(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    Promotions.create(req.body)
    .then(promo => {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.json(promo);
    })
    .catch(err => next(err));
  })
  .put(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /promotions');
  })
  .delete(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    Promotions.deleteMany({})
    .then(resp => {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.json(resp);
    })
  });

promoRouter.route('/:promoId')
  .get((req, res, next) =>{
    Promotions.findById(req.params.promoId)
    .then(promo => {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.json(promo);
    })
    .catch(err => next(err));
  })
  .post(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    res.statusCode = 403;
    res.end(`POST operation not supported on /promotions/${req.params.promoId}`);
  })
  .put(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    Promotions.findByIdAndUpdate(req.params.promoId, {
      $set: req.body
    }, {
      new: true
    })
    .then(promo => {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.json(promo);
    })
    .catch(err => next(err));
  })
  .delete(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    Promotions.findByIdAndRemove(req.params.promoId)
    .then(promo => {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.json(promo);
    })
    .catch(err => next(err));
  });

module.exports = promoRouter;