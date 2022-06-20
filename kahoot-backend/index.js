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
  passport.authenticate("local-signup", { session: false }),
  (req, res) => {
    res.json({
      user: req.user,
    });
  }
);

app.listen(PORT, (error) => {
  if (!error) console.log("Listening on port " + PORT);
  else console.log("Error!", error);
});
