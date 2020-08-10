const express = require('express');
const ensured_logging = require('connect-ensure-login');
const secrets = require("../config/secrets.json")

const models = require("../models/Users")
const User = models.user
const ToneGuess = models.tone_guess

function sanitizeString(str){
    str = str.replace(/[^a-z0-9áéíóúñü \.,_-]/gim,"");
    return str.trim();
}
function validateEmail(email) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}
function wrapper(passport) {
    const router = express.Router();

    router.post('/game/add',ensured_logging.ensureLoggedIn(secrets.base_uri+"auth/login"), function (req, res) {
        g = new ToneGuess({ user: req.user.id, choosedFrequency: req.body.randomFequency, guessedFrequency:req.body.selectedFrequency, when:Date.now() })
        g.save(function (err) {
            if (err) console.log(err); // saved!
        });
        res.send({
            "result": "ok"
        })
    });

    router.post('/user/reset',ensured_logging.ensureLoggedIn(secrets.base_uri+"auth/login"), function (req, res) {
        req.user.frequencyResponse_low  = -1;
        req.user.frequencyResponse_high = 20000;

        req.user.save(function (err) {
            if (err) console.log(err); // saved!
        });

        ToneGuess.find({ user : req.user._id }).deleteMany().exec(function (err, guesss) {
            if (err) { console.log(err); return; }

            res.send({"result": "ok"})
        });
    });


    router.post('/user/delete',ensured_logging.ensureLoggedIn(secrets.base_uri+"auth/login"), function (req, res) {
        ToneGuess.find({ user : req.user._id }).deleteMany().exec(function (err, guesss) {
            if (err) { console.log(err); return; }

            User.findOneAndDelete({ _id : req.user._id }).exec(function () {
                res.send({"result": "ok"})
            })
        });
    });

    router.post('/user/save',ensured_logging.ensureLoggedIn(secrets.base_uri+"auth/login"), function (req, res) {

        req.user.displayName = sanitizeString(req.body.name)
        if(validateEmail(req.body.email)) {
            req.user.email = req.body.email;
        }
        if(!isNaN(req.body.age)) {
            req.user.age = Number(req.body.age)
        }
        req.user.save(function (err) {
            if (err) console.log(err); // saved!

            res.send({
                "result": "ok"
            })
        });
    });

    router.post('/response_test',ensured_logging.ensureLoggedIn(secrets.base_uri+"auth/login"), function (req, res) {
        console.log(req.body);
        req.user.frequencyResponse_low  = req.body.min;
        req.user.frequencyResponse_high = req.body.max;

        req.user.save(function (err) {
            if (err) console.log(err); // saved!
        });
        res.send({
            "result": "ok"
        })
    });



    return router
}


module.exports = wrapper;