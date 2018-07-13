// routes/auth-routes.js
const express = require("express");
const authRoutes = express.Router();
const passport = require("passport");
const ensureLogin = require("connect-ensure-login");


// User model
const User = require("../models/user");

// Bcrypt to encrypt passwords
const bcrypt = require("bcrypt");
const bcryptSalt = 10;

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
 
  authRoutes.get("/login", (req, res, next) => {
    res.render("auth/login");
  });

  authRoutes.post("/login", (req, res, next) => {
    const username = req.body.username;
    const password = req.body.password;
  
    if (username === "" || password === "") {
      res.render("auth/login", {
        errorMessage: "Enter a username and a password to sign up"
      });
      return;
    }
  
    User.findOne({ "username": username }, (err, user) => {
        if (err || !user) {
          res.render("auth/login", {
            errorMessage: "Username doesn't exist, plese sign up"
          });
          return;
        }
        if (bcrypt.compareSync(password, user.password)) {
          // Save the login in the session!
          req.session.currentUser = user;
          res.redirect("/");
        } else {
          res.render("auth/login", {
            errorMessage: "Incorrect password"
          });
        }
    });
  });


authRoutes.get("/signup", (req, res, next) => {
  res.render("auth/signup");
});

authRoutes.post("/signup", (req, res, next) => {
  const useraname = req.body.username;
  const password = req.body.password;

  if (username === "" || password === "") {
    res.render("auth/signup", { 
      eerrorMessage: "Enter username and password to sign up" });
    return;
  }

  User.findOne({ "username": username })
.then(user => {
  if (user !== null) {
      res.render("auth/signup", {
        errorMessage: "The username already exists"
      });
      return;
    }

    const salt = bcrypt.genSaltSync(bcryptSalt);
    const hashPass = bcrypt.hashSync(password, salt);

    const newUser = new User({
      username,
      password: hashPass
    });

    newUser.save()
    .then(user => {
      res.redirect("/");
    });
})
    // newUser.save((err) => {
    //   if (err) {
    //     res.render("auth/signup", { message: "Error, please retry" });
    //   } else {
    //     res.redirect("/");
    //   }
    // });
  // })
  
  .catch(error => {
    next(error);
  });
});

module.exports = authRoutes;