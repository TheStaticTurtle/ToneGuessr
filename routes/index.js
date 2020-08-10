const express = require('express');

function wrapper(passport) {
  const router = express.Router();

  /* GET home page. */
  router.get('/', function(req, res, next) {
    res.render('index', { title: 'Home', user: req.user });
  });

  return router
}

module.exports = wrapper;
