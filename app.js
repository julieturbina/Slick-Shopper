require('dotenv').config();

const bodyParser   = require('body-parser');
const cookieParser = require('cookie-parser');
const express = require('express');
const session    = require("express-session");
const MongoStore = require("connect-mongo")(session);
const favicon      = require('serve-favicon');
const hbs          = require('hbs');
const mongoose     = require('mongoose');
const logger       = require('morgan');
const path         = require('path');
const index = require('./routes/index');
const authRoutes = require('./routes/auth-routes');
const socialiteRoutes = require('./routes/socialite');

  const bcrypt       = require("bcrypt");
  const passport     = require("passport");
  const LocalStrategy= require("passport-local").Strategy;
  const User         = require("./models/user");
  const flash        = require("connect-flash");

const FbStrategy = require('passport-facebook').Strategy;
// const GoogleStrat  = require("passport-google-oauth").OAuth2Strategy;
// bcrypt start =======================================

const saltRounds = 10;

const plainPassword1 = "HelloWorld";
const plainPassword2 = "helloworld";

const salt  = bcrypt.genSaltSync(saltRounds);
const hash1 = bcrypt.hashSync(plainPassword1, salt);
const hash2 = bcrypt.hashSync(plainPassword2, salt);

console.log("Hash 1 -", hash1);
console.log("Hash 2 -", hash2);
// bcrypt end ========================================
mongoose.Promise = Promise;
mongoose
  .connect('mongodb://localhost/Socialite', {useMongoClient: true})
  .then(() => {
    console.log('Connected to Mongo!');
  }).catch(err => {
    console.error('Error connecting to mongo', err);
  });


const app_name = require('./package.json').name;
const debug = require('debug')(`${app_name}:${path.basename(__filename).split('.')[0]}`);

const app = express();

// Middleware Setup
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({
  secret: "Socialite",
  resave: true,
  saveUninitialized: true,
  cookie: { maxAge: 600000000 },
  store: new MongoStore({
  mongooseConnection: mongoose.connection,
  ttl: 24 * 60 * 60 // 1 day
})
}));

app.use('/', index);
app.use('/', authRoutes);
app.use('/', socialiteRoutes);

// Express View engine setup

app.use(require('node-sass-middleware')({
  src:  path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public'),
  sourceMap: true
}));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(favicon(path.join(__dirname, 'public', 'images', 'favicon.ico')));

// passport start ==================

passport.serializeUser((user, cb) => {
  cb(null, user._id);
});

passport.deserializeUser((id, cb) => {
  User.findById(id, (err, user) => {
    if (err) { return cb(err); }
    cb(null, user);
  });
});

app.use(flash());


// //facebook start ==================
passport.use(new FbStrategy({
  clientID: "facebookId",
  clientSecret: "secretKey",
  callbackURL: "/auth/facebook/callback"
}, (accessToken, refreshToken, profile, done) => {
  User.findOne({ facebookID: profile.id }, (err, user) => {
    if (err) {
      return done(err);
    }
    if (user) {
      return done(null, user);
    }

    const newUser = new User({
      facebookID: profile.id
    });

    newUser.save((err) => {
      if (err) {
        return done(err);
      }
      done(null, newUser);
    });
  });

}));
// // facebook end =============
// //google start =============
// // passport.use(new GoogleStrat({
// //   clientID: process.env.GOCLIENT,
// //   clientSecret: process.env.GOSECRET,
// //   callbackURL: "/auth/google/callback"
// // }, (accessToken, refreshToken, profile, done) => {
// //   User.findOne({ googleID: profile.id }, (err, user) => {
// //     if (err) {
// //       return done(err);
// //     }
// //     if (user) {
// //       return done(null, user);
// //     }

// //     const newUser = new User({
// //       googleID: profile.id
// //     });

// //     newUser.save((err) => {
// //       if (err) {
// //         return done(err);
// //       }
// //       done(null, newUser);
// //     });
// //   });

// // }));
// // google end ================
passport.use(new LocalStrategy({
  passReqToCallback: true
  },(req, username, password, next) => {
  User.findOne({ username }, (err, user) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return next(null, false, { message: "Incorrect username!!!" });
    }
    if (!bcrypt.compareSync(password, user.password)) {
      return next(null, false, { message: "Incorrect password" });
    }

    return next(null, user);
  });
}));

app.use(passport.initialize());
app.use(passport.session());

/// passport end - facebook and google in between========

// default value for title local
app.locals.title = 'The Socialite';


module.exports = app;
