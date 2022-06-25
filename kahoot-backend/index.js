const express = require("express");
const session = require("express-session");
const dotenv = require("dotenv").config();
const db = require("./db");
const bodyParser = require("body-parser");
const passport = require("passport");
const passportConfig = require("./passportConfig");
const connectEnsureLogin = require("connect-ensure-login");
const User = require("./models/userModel");
const app = express();
const PORT = 5000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 30 * 24 * 60 * 60 * 1000 },
  })
);
app.use(passport.initialize());
app.use(passport.session());

db.connect(process.env.DBURL);
passportConfig(passport);

app.post(
  "/api/v1/signup",
  passport.authenticate("local-signup"),
  (req, res) => {
    res.json({
      user: req.user,
    });
  }
);

app.post(
  "/api/v1/signin",
  passport.authenticate("local-signin", {
    failureRedirect: "/error",
  }),
  (req, res) => {
    res.json({
      sucess: "success",
    });
  }
);

app.post(
  "/api/v1/getUser",
  connectEnsureLogin.ensureLoggedIn("/noway"),
  (req, res) => {
    res.json({
      name: req.user.name,
    });
  }
);

app.listen(PORT, (error) => {
  if (!error) console.log("Listening on port " + PORT);
  else console.log("Error!", error);
});
