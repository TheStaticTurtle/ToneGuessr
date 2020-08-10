const mongoose = require("mongoose")
var findOrCreate = require('mongoose-findorcreate')

const ToneGuessSchema = new mongoose.Schema(
    {
        user : {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'user',
            required: true,
        },
        choosedFrequency: {
            type: Number,
            required: true,
        },
        guessedFrequency: {
            type: Number,
            required: true,
        },
        when: {
            type:Date,
            default: Date.now()
        },
    },
    {
        strict: false
    }
);

const UserSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        displayName: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
        },
        joined_date: {
            type:Date,
            default: Date.now()
        },
        age: {
            type:Number,
            default: -1
        },

        toneGuesses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'tone_guess' }],

        frequencyResponse_low:{
            type:Number,
            default: -1
        },
        frequencyResponse_high:{
            type:Number,
            default: 20000
        },

        profilePicture: {
            type:String
        },
        googleId: {
            type:Number
        }
    },
    {
        strict: false
    }
);

UserSchema.plugin(findOrCreate);

User = mongoose.model("user",UserSchema)
ToneGuess = mongoose.model("tone_guess",ToneGuessSchema)

module.exports = {"user":User,"tone_guess":ToneGuess}