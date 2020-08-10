const express = require('express');
const ensured_logging = require('connect-ensure-login');

function wrapper(passport) {
    const router = express.Router();

    router.get('/', function (req, res) {
        res.render("play", { title: 'Play', user: req.user })
    });

    router.get('/response', function (req, res) {
        res.render("play-response", { title: 'Frequency Response test', user: req.user })
    });

    return router
}


module.exports = wrapper;