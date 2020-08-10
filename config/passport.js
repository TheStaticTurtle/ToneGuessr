const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const TwitterStrategy = require('passport-twitter').Strategy;
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
                    profilePicture: profile.photos ? profile.photos[0].value : "https://upload.wikimedia.org/wikipedia/commons/1/1e/Default-avatar.jpg",
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
        callbackURL: secrets.auth.facebook.callback_uri,
        profileFields: ['id', 'displayName', 'name', 'gender', 'picture.type(large)']
    },
    function(accessToken, refreshToken, profile, done) {
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
                    profilePicture: profile.photos ? profile.photos[0].value : "https://upload.wikimedia.org/wikipedia/commons/1/1e/Default-avatar.jpg",
                }).save().then((newUser) =>{
                    done(null, newUser);
                });
            }
        })
    }
));

passport.use(new TwitterStrategy({
        consumerKey: secrets.auth.twitter.consumerKey,
        consumerSecret: secrets.auth.twitter.consumerSecret,
        callbackURL: secrets.auth.twitter.callback_uri
    },
    function(token, tokenSecret, profile, done) {
        User.findOne({twitterId: profile.id}).then((currentUser)=>{
            if(currentUser){
                //if we already have a record with the given profile ID
                done(null, currentUser);
            } else{
                //if not, create a new user
                new User({
                    twitterId: profile.id,
                    email: profile.email,
                    displayName: profile.displayName,
                    name: profile.username,
                    profilePicture: profile._json.profile_image_url_https,
                }).save().then((newUser) =>{
                    done(null, newUser);
                });
            }
        })
    }
));

module.exports = passport