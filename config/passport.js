const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const User = require("../models/Users").user

const secrets = require("./secrets.json")

passport.serializeUser((user, done) => {
    done(null, user.id);
});
passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
        done(err,user);
    });
});
passport.use(new GoogleStrategy({
        clientID: secrets.auth.google.client_id,
        clientSecret: secrets.auth.google.client_secret,
        callbackURL: secrets.auth.google.callback_uri
    },
    function(token, tokenSecret, profile, done) {
        console.log(profile);
        User.findOne({googleId: profile.id}).then((currentUser)=>{
            if(currentUser){
                //if we already have a record with the given profile ID
                done(null, currentUser);
            } else{
                //if not, create a new user
                new User({
                    googleId: profile.id,
                    email: profile.emails[0].value,
                    displayName: profile.displayName,
                    name: profile.name.givenName,
                    profilePicture: profile.photos[0].value,
                }).save().then((newUser) =>{
                    done(null, newUser);
                });
            }
        })
    }
));

passport.use(new FacebookStrategy({
        clientID: secrets.auth.facebook.app_id,
        clientSecret: secrets.auth.facebook.app_secret,
        callbackURL: secrets.auth.facebook.callback_uri
    },
    function(accessToken, refreshToken, profile, done) {
        console.log(profile)
        User.findOne({facebookId: profile.id}).then((currentUser)=>{
            if(currentUser){
                //if we already have a record with the given profile ID
                done(null, currentUser);
            } else{
                //if not, create a new user
                new User({
                    facebookId: profile.id,
                    email: profile.email,
                    displayName: profile.displayName,
                    name: profile.name.givenName,
                    profilePicture: "https://upload.wikimedia.org/wikipedia/commons/1/1e/Default-avatar.jpg",
                }).save().then((newUser) =>{
                    done(null, newUser);
                });
            }
        })
    }
));

module.exports = passport