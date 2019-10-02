"use strict";

var _ChatController = require("./controllers/ChatController");

var _ChatController2 = _interopRequireDefault(_ChatController);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var express = require("express");
var app = express();
var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
var mongoose = require("mongoose");


mongoose.connect("mongodb://localhost/Chat", { useNewUrlParser: true });
var db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error"));
db.once("open", function () {
  // We're connecter
  console.log("connecter to the db");

  // Initialise controllers
  (0, _ChatController2.default)(app);
});

//

app.use(function (req, res, next) {
  res.setHeader("Access-Control-Allow-Headers", "X-Requested-With,content-type,Authorization");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");
  next();
});

app.listen(8080);