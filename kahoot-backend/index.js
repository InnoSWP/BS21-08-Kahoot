const express = require("express");
const db = require("./db");
const bodyParser = require("body-parser");
const passport = require("passport");
const passportConfig = require("./passportConfig");
const app = express();
const PORT = 5000;

const LocalStrategy = require("passport-local");
const User = require("./models/userModel");

db.connect();
passportConfig(passport);

app.use(bodyParser.urlencoded({ extended: true }));

app.post(
  "/signup",
  /* function (req, res, next) {
    console.log(req.body);
    // call passport authentication passing the "local" strategy name and a callback function
    passport.authenticate("local-signup", function (error, user, info) {
      // this will execute in any case, even if a passport strategy will find an error
      // log everything to console
      console.log(error);
      console.log(user);
      console.log(info);

      if (error) {
        res.status(401).send(error);
      } else if (!user) {
        res.status(401).send(info);
      } else {
        next();
      }

      res.status(401).send(info);
    })(req, res);
  }, */
  passport.authenticate("local-signup", { session: false }),
  (req, res, next) => {
    res.json({
      user: req.user,
    });
  }
);

app.listen(PORT, (error) => {
  if (!error) console.log("Listening on port " + PORT);
  else console.log("Error!", error);
});
