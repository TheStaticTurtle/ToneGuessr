const express = require('express');
const ensured_logging = require('connect-ensure-login');

function wrapper(passport) {
    const router = express.Router();

    router.get('/', function (req, res) {
        res.render('faq/faq', { title: 'F.A.Q.', user: req.user });
    });
    router.get('/privacy', function (req, res) {
        res.render('faq/privacy_policy', { title: 'Privacy policy', user: req.user });
    });
    router.get('/tos', function (req, res) {
        res.render('faq/tos', { title: 'Term of use', user: req.user });
    });

    return router
}


module.exports = wrapper;