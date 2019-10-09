"use strict";

var express = require("express");
var app = express();
var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
var mongoose = require("mongoose");
var chatController = require("./controllers/ChatController").default;
var userController = require("./controllers/UserController").default;
var messageController = require("./controllers/MessageController").default;

mongoose.connect("mongodb://localhost/Chat", { useNewUrlParser: true });
var db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error"));
db.once("open", function () {
  // We're connecter
  console.log("connecter to the db");

  // Initialise controllers
  chatController(app);
  userController(app);
  messageController(app);
});

//

app.use(function (req, res, next) {
  res.setHeader("Access-Control-Allow-Headers", "X-Requested-With,content-type,Authorization");
  // res.header("Access-Control-Allow-Credentials", true);
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");
  next();
});

var server = app.listen(8080);
var io = require("socket.io")(server);

io.on("connection", function (socket) {
  console.log(socket.id);

  socket.on("SEND_MESSAGE", function (data) {
    io.emit("RECEIVE_MESSAGE", data);
  });
});