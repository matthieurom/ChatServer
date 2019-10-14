var express = require("express");
var http = require("http");
var app = express();
var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
var mongoose = require("mongoose");
var chatController = require("./controllers/ChatController").default;
var userController = require("./controllers/UserController").default;
var messageController = require("./controllers/MessageController").default;

var server = http.createServer(app);
var io = require("socket.io")(server);

mongoose.connect("mongodb://localhost/Chat", { useNewUrlParser: true });
var db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error"));
db.once("open", () => {
  // We're connecter
  console.log("connecter to the db");

  // Initialise controllers
  chatController(app);
  userController(app);
  messageController(app, io);
});

//

app.use(function(req, res, next) {
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-Requested-With,content-type,Authorization"
  );
  // res.header("Access-Control-Allow-Credentials", true);
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );
  next();
});

server.listen(8080);
