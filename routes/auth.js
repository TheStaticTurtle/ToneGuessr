const express = require('express');
const ensured_logging = require('connect-ensure-login');
const secrets = require("../config/secrets.json")

const models = require("../models/Users")
const User = models.user
const ToneGuess = models.tone_guess

function wrapper(passport) {
    const router = express.Router();

    router.get('/google', passport.authenticate('google', { scope: ["openid","profile", "email"] }));
    router.get('/google/callback', passport.authenticate('google', { failureRedirect: '/login' }), function(req, res) {
        res.redirect(secrets.base_uri+'auth/profile');
    });

    router.get('/facebook', passport.authenticate('facebook', { scope: ["email"]}));
    router.get('/facebook/callback', passport.authenticate('facebook', { failureRedirect: '/login' }), function(req, res) {
        res.redirect(secrets.base_uri+'auth/profile');
    });

    router.get('/twitter', passport.authenticate('twitter', { scope: ["email"]}));
    router.get('/twitter/callback', passport.authenticate('twitter', { failureRedirect: '/login' }), function(req, res) {
        res.redirect(secrets.base_uri+'auth/profile');
    });


    router.get('/logout', ensured_logging.ensureLoggedIn(secrets.base_uri+"auth/login"), function(req, res){
        req.logout();
        res.redirect(secrets.base_uri);
    });

    router.get('/profile',ensured_logging.ensureLoggedIn(secrets.base_uri+"auth/login"), function(req, res){
        ToneGuess.find({ user : req.user._id }).exec(function (err, guesss) {
            if (err) { console.log(err); return; }

            let meanOffset = -1;
            if(guesss.length > 0) {
                let offset = guesss[0].guessedFrequency - guesss[0].choosedFrequency
                meanOffset = offset < 0 ? offset * -1 : offset
                for(let i=1; i<guesss.length; i++) {
                    let offset = guesss[i].guessedFrequency - guesss[i].choosedFrequency
                    meanOffset += offset < 0 ? offset * -1 : offset
                }
            }
            let guesss_accuracy = meanOffset>0 ? (meanOffset/guesss.length) : -1

            let accuracyPerFrequencyChart = []
            let accuracyPerFrequencyChart_keys = []
            for (let i=20; i<10000; i+= 300) {
                p = {mean:0, "count":0}
                for(let o=0; o<guesss.length; o++) {
                    if(guesss[o].choosedFrequency < i && guesss[o].choosedFrequency > i-200) {
                        p.mean += guesss[o].guessedFrequency - guesss[o].choosedFrequency;
                        p.count += 1;
                    }
                }
                accuracyPerFrequencyChart.push(p.count > 0 ? p.mean/p.count : 0)
                accuracyPerFrequencyChart_keys.push(i)
            }

            res.render("profile", {
                title: 'Profile',
                user: req.user,
                guesss: guesss,
                accuracyPerFrequencyChart: accuracyPerFrequencyChart,
                accuracyPerFrequencyChart_keys: accuracyPerFrequencyChart_keys,
                guesss_accuracy: Math.round(guesss_accuracy*10)/10
            });
        });
    });

    router.get('/login', function(req, res){
        res.redirect(secrets.base_uri+"login");
    });

    return router
}


module.exports = wrapper;