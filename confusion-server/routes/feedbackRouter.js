const bodyParser = require('body-parser');
const express = require('express');
const mongoose = require('mongoose');

const authenticate = require('../authenticate');
const cors = require('./cors');
const Feedbacks = require('../models/feedbacks');

const feedbackRouter = express.Router();

feedbackRouter.use(bodyParser.json());

feedbackRouter.route('/')
  .options(cors.corsWithOptions, (req, res) => { res.sendStatus(200) })
  .get(cors.cors, (req, res, next) =>{
    Feedbacks.find({})
    .then(feedbacks => {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.json(feedbacks);
    })
    .catch(err => next(err))
  })
  .post(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    Feedbacks.create(req.body)
    .then(feedback => {
      console.log(`Feedback created: ${feedback}`);
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.json(feedback);
    })
    .catch(err => next(err))
  })
  .put(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /feedbacks');
  })
  .delete(cors.corsWithOptions,authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    Feedbacks.deleteMany({})
    .then(resp => {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.json(resp);
    })
    .catch(err => next(err))
  });

module.exports = feedbackRouter;