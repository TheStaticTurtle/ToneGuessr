const express = require('express');
const ensured_logging = require('connect-ensure-login');

function wrapper(passport) {
    const router = express.Router();

    router.get('/login', function (req, res) {
        res.render("login")
    });

    return router
}


module.exports = wrapper;