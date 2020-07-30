// Configure Strategy
// =============================================================================
const passport = require("passport");
var JwtCookieComboStrategy = require("passport-jwt-cookiecombo");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcryptjs");
const User = require("../models/User.model");

// =============================================================================
// Sample Passport Authentication where the user is set for the jwt payload
// =============================================================================
passport.use(
  new LocalStrategy(
    { usernameField: "email", session: false },
    (email, password, done) => {
      //Match user
      User.findOne({ email: email })
        .then((user) => {
          if (!user) {
            return done(null, false, {
              message: "that email is not registered",
            });
          }

          //match password

          bcrypt.compare(password, user.password, (err, isMatch) => {
            if (err) throw err;
            if (isMatch) {
              return done(null, {
                id: user._id,
              });
            } else {
              return done(null, false, { message: "password incorrect" });
            }
          });
        })
        .catch((err) => console.log(err));
    }
  )
);

// Authenticate API calls with the Cookie Combo Strategy
passport.use(
  new JwtCookieComboStrategy(
    {
      secretOrPublicKey: process.env.JWT_PUBLIC_KEY,
    },
    (payload, done) => {
      return done(null, payload.user);
    }
  )
);
