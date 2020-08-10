var createError = require('http-errors');
var express = require('express');
var session = require("express-session");
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser')
var logger = require('morgan');
var MongoStore = require("connect-mongo")(session)
var mongoose = require("mongoose")
var passport = require("./config/passport")
var secrets = require("./config/secrets.json")

var indexRouter = require('./routes/index')(passport);
var authRouter = require('./routes/auth')(passport);
var loginRouter = require('./routes/login')(passport);
var playRouter = require('./routes/play')(passport);
var apiRouter = require('./routes/api')(passport);
var faqRouter = require('./routes/faq')(passport);

mongoose
    .connect(secrets.database.mongodb_uri, {useNewUrlParser: true, useUnifiedTopology: true})
    .then(console.log(`MongoDB conected`))
    .catch(err => console.log(err));


var app = express();

app.locals={
    site: {
        base_uri: secrets.base_uri,
        ga_tag: secrets.ga_tag
    }
};

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'twig');
app.set('view cache', false)
app.set('trust proxy', 1) // trust first proxy

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use("/public",express.static(path.join(__dirname, 'public')));
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
    extended: true
}));

app.use(session({
    secret:"YWontKnowThat",
    resave: false,
    saveUninitialized: true,
    store: new MongoStore({mongooseConnection: mongoose.connection})
}));

app.use(session({
    genid: function(req) {
        return uuid.v4(); // This comes from the node-uuid package
    },
    secret: 'secret key',
    cookie: { secure:  true,
        expires: new Date(Date.now() + 24*60*60*1000,),
        maxAge:  24*60*60*1000, },
    saveUninitialized: true,
    resave: true
}));

app.use(passport.initialize());
app.use(passport.session());

app.use('/', indexRouter);
app.use('/', loginRouter);
app.use('/play', playRouter);
app.use('/auth', authRouter);
app.use('/api',  apiRouter);
app.use('/faq',  faqRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500);
  res.render('error');
});



module.exports = app;
