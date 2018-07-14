const express = require("express");
const authRoutes = express.Router();
// const Recaptcha = require('express-recaptcha').Recaptcha;
// const recaptcha = new Recaptcha('qwerty', 'secret');
const passport = require("passport");
const ensureLogin = require("connect-ensure-login");

  
// User model
const Provider = require('../models/provider');
const services = require('../models/services');
const User           = require("../models/user");

// Bcrypt to encrypt passwords
const bcrypt = require('bcrypt');
const bcryptSalt = 10;

// facebook login start ===========================
authRoutes.get("/auth/facebook", passport.authenticate("facebook"));
authRoutes.get("/auth/facebook/callback", passport.authenticate("facebook", {
  successRedirect: "/private-page",
  failureRedirect: "/"
}));

// facebook login end ======================

// google login start =======================

authRoutes.get("/auth/google", passport.authenticate("google", {
    scope: ["https://www.googleapis.com/auth/plus.login",
            "https://www.googleapis.com/auth/plus.profile.emails.read"]
  }));
  
  authRoutes.get("/auth/google/callback", passport.authenticate("google", {
    failureRedirect: "/",
    successRedirect: "/private-page"
  }));

// google login end ====================


// testing==================start
authRoutes.get("/signup", (req, res, next) => {
  res.render("auth/signup", { captcha:recaptcha.render() });
});

authRoutes.get("/login", (req, res, next) => {
  res.render("auth/login");
});

authRoutes.post("/signup", (req, res, next) => {
    const username = req.body.username;
    const password = req.body.password;
  
    if (username === "" || password === "") {
        res.render("auth/signup", {
          errorMessage: "Indicate a username and a password to sign up"
        });
        return;
      }
      User.findOne({ "username": username })
      .then(user => {
        console.log('user', user);
      if (user !== null) {
        res.render("auth/signup", {
          errorMessage: "The username already exists"
        });
        return;
      }

      const salt     = bcrypt.genSaltSync(bcryptSalt);
      const hashPass = bcrypt.hashSync(password, salt);
      const checkPass = zxcvbn(password);
      console.log('checkPass: ', checkPass);
    
      const newUser  = User({
        username,
        password: hashPass
      });
    
      newUser.save()
      .then(user => {
        res.redirect("/");
      })
  });
})

module.exports = authRoutes;


// testing ================end




//   authRoutes.get("/logout", (req, res, next) => {
//     req.session.destroy((err) => {
//       // cannot access session here
//       res.redirect("/login");
//     });
//   });

// authRoutes.get("/private-page", ensureLogin.ensureLoggedIn(), (req, res) => {
//     res.render("private", { user: req.user });
//   });


// authRoutes.get('/login', (req, res, next) => {
// res.render('auth/login', {
// errorMessage: ''
// });
// });

// authRoutes.post('/login', (req, res, next) => {
// const emailInput = req.body.email;
// const passwordInput = req.body.password;
// if (emailInput === '' || passwordInput === '') {
// res.render('auth/login', {
// errorMessage: 'Please enter email and password to log in.'
// });
// return;
// }
// User.findOne({ email: emailInput }, (err, theUser) => {
// if (err || theUser === null) {
// res.render('auth/login', {
// errorMessage: `There isn't an account with email ${emailInput}.`
// });
// return;
// }
// if (!bcrypt.compareSync(passwordInput, theUser.password)) {
// res.render('auth/login', {
// errorMessage: 'Invalid password.'
// });
// return;
// }
// req.session.currentUser = theUser;
// res.redirect('/');
// });
// });

// // NEW SIGNUP

// authRoutes.post('/signup', (req, res, next) => {
//   router.get('/signup', (req, res, next) => {
// res.render('auth/signup', {
// errorMessage: ''
// });
// });

// authRoutes.post('/signup', (req, res, next) => {
// const nameInput = req.body.name;
// const emailInput = req.body.email;
// const passwordInput = req.body.password;

// const {name, email, password} = req.body;

// if (emailInput === '' || passwordInput === '') {
// res.render('auth/signup', {
// errorMessage: 'Enter both email and password to sign up.'
// });
// return;
// }

// User.findOne({ email: emailInput }, '_id', (err, existingUser) => {
// if (err) {
// next(err);
// return;
// }

// if (existingUser !== null) {
// res.render('auth/signup', {
// errorMessage: `The email ${emailInput} is already in use.`
// });
// return;
// }

// const salt = bcrypt.genSaltSync(bcryptSalt);
// const hashedPass = bcrypt.hashSync(passwordInput, salt);

// const userSubmission = {
// name,
// email,
// password: hashedPass
// };

// const theUser = new User(userSubmission);

// theUser.save((err) => {
// if (err) {
// res.render('auth/signup', {
// errorMessage: 'Error detected, please try again later.'
// });
// return;
// }

// res.redirect('/');
// });
// });
// });

// authRoutes.get('/login', (req, res, next) => {
// res.render('auth/login', {
// errorMessage: ''
// });
// });

// authRoutes.post('/login', (req, res, next) => {
// const emailInput = req.body.email;
// const passwordInput = req.body.password;
// if (emailInput === '' || passwordInput === '') {
// res.render('auth/login', {
// errorMessage: 'Email and password are required to log in.'
// });
// return;
// }
// User.findOne({ email: emailInput }, (err, theUser) => {
// if (err || theUser === null) {
// res.render('auth/login', {
// errorMessage: `Account not found, please sign up ${emailInput}.`
// });
// return;
// }
// if (!bcrypt.compareSync(passwordInput, theUser.password)) {
// res.render('auth/login', {
// errorMessage: 'Invalid password.'
// });
// return;
// }
// req.session.currentUser = theUser;
// res.redirect('/');
// });
// });


// authRoutes.get('/logout', (req, res, next) => {
// if (!req.session.currentUser) {
// res.redirect('/');
// return;
// }

// req.session.destroy((err) => {
// if (err) {
// next(err);
// return;
// }

// res.redirect('/');
// });
// });


// module.exports = authRoutes;