const express = require("express");
const User = require('../models/user');
const bcrypt = require('bcrypt');
const router = express.Router();
const bcryptSalt = 10;
  const authRoutes = express.Router();
  const passport = require("passport");
  const ensureLogin = require("connect-ensure-login");


// User model


// Bcrypt to encrypt passwords


// facebook login start

authRoutes.get("/auth/facebook", passport.authenticate("facebook"));
authRoutes.get("/auth/facebook/callback", passport.authenticate("facebook", {
  successRedirect: "/private-page",
  failureRedirect: "/"
}));

// facebook login end

// google login start

authRoutes.get("/auth/google", passport.authenticate("google", {
    scope: ["https://www.googleapis.com/auth/plus.login",
            "https://www.googleapis.com/auth/plus.profile.emails.read"]
  }));
  
  authRoutes.get("/auth/google/callback", passport.authenticate("google", {
    failureRedirect: "/",
    successRedirect: "/private-page"
  }));

// google login end

  authRoutes.get("/logout", (req, res, next) => {
    req.session.destroy((err) => {
      // cannot access session here
      res.redirect("/login");
    });
  });

authRoutes.get("/private-page", ensureLogin.ensureLoggedIn(), (req, res) => {
    res.render("private", { user: req.user });
  });


  router.get('/login', (req, res, next) => {
res.render('auth/login', {
errorMessage: ''
});
});

router.post('/login', (req, res, next) => {
const emailInput = req.body.email;
const passwordInput = req.body.password;
if (emailInput === '' || passwordInput === '') {
res.render('auth/login', {
errorMessage: 'Please enter email and password to log in.'
});
return;
}
User.findOne({ email: emailInput }, (err, theUser) => {
if (err || theUser === null) {
res.render('auth/login', {
errorMessage: `There isn't an account with email ${emailInput}.`
});
return;
}
if (!bcrypt.compareSync(passwordInput, theUser.password)) {
res.render('auth/login', {
errorMessage: 'Invalid password.'
});
return;
}
req.session.currentUser = theUser;
res.redirect('/');
});
});

// NEW SIGNUP

router.get('/signup', (req, res, next) => {
res.render('auth/signup', {
errorMessage: ''
});
});

router.post('/signup', (req, res, next) => {
const nameInput = req.body.name;
const emailInput = req.body.email;
const passwordInput = req.body.password;

const {name, email, password} = req.body;

if (emailInput === '' || passwordInput === '') {
res.render('auth/signup', {
errorMessage: 'Enter both email and password to sign up.'
});
return;
}

User.findOne({ email: emailInput }, '_id', (err, existingUser) => {
if (err) {
next(err);
return;
}

if (existingUser !== null) {
res.render('auth/signup', {
errorMessage: `The email ${emailInput} is already in use.`
});
return;
}

const salt = bcrypt.genSaltSync(bcryptSalt);
const hashedPass = bcrypt.hashSync(passwordInput, salt);

const userSubmission = {
name,
email,
password: hashedPass
};

const theUser = new User(userSubmission);

theUser.save((err) => {
if (err) {
res.render('auth/signup', {
errorMessage: 'Error detected, please try again later.'
});
return;
}

res.redirect('/');
});
});
});

router.get('/login', (req, res, next) => {
res.render('auth/login', {
errorMessage: ''
});
});

router.post('/login', (req, res, next) => {
const emailInput = req.body.email;
const passwordInput = req.body.password;
if (emailInput === '' || passwordInput === '') {
res.render('auth/login', {
errorMessage: 'Email and password are required to log in.'
});
return;
}
User.findOne({ email: emailInput }, (err, theUser) => {
if (err || theUser === null) {
res.render('auth/login', {
errorMessage: `Account not found, please sign up ${emailInput}.`
});
return;
}
if (!bcrypt.compareSync(passwordInput, theUser.password)) {
res.render('auth/login', {
errorMessage: 'Invalid password.'
});
return;
}
req.session.currentUser = theUser;
res.redirect('/');
});
});


router.get('/logout', (req, res, next) => {
if (!req.session.currentUser) {
res.redirect('/');
return;
}

req.session.destroy((err) => {
if (err) {
next(err);
return;
}

res.redirect('/');
});
});


module.exports = router;


