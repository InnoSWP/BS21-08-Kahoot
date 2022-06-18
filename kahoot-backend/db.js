const fs = require("fs");
const mongoose = require("mongoose");

let dburl = "mongodb://127.0.0.1:27017/kahootdb";

fs.readFile("./config", "utf8", (err, data) => {
  if (err) {
    return console.log(err);
  }
  dburl = data;
});

const connect = async () => {
  mongoose.connect(dburl, { useNewUrlParser: true, useUnifiedTopology: true });
  const db = mongoose.connection;
  db.on("error", () => {
    console.log("could not connect");
  });
  db.once("open", () => {
    console.log("> Successfully connected to database");
  });
};

module.exports = { connect };
