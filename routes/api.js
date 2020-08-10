const express = require('express');
const ensured_logging = require('connect-ensure-login');

const models = require("../models/Users")
const User = models.user
const ToneGuess = models.tone_guess

function wrapper(passport) {
    const router = express.Router();

    router.post('/game/add',ensured_logging.ensureLoggedIn("/auth/login"), function (req, res) {
        console.log(req.body)
        g = new ToneGuess({ user: req.user.id, choosedFrequency: req.body.randomFequency, guessedFrequency:req.body.selectedFrequency, when:Date.now() })
        g.save(function (err) {
            if (err) console.log(err); // saved!
        });
        res.send({
            "result": "ok"
        })
    });

    router.post('/user/reset',ensured_logging.ensureLoggedIn("/auth/login"), function (req, res) {

        ToneGuess.find({ user : req.user._id }).deleteMany().exec(function (err, guesss) {
            if (err) { console.log(err); return; }

            res.send({"result": "ok"})
        });

    });

    return router
}


module.exports = wrapper;