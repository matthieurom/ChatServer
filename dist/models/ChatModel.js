"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var mongoose = require("mongoose");

// Define structure of our Chats
var chatSchema = new mongoose.Schema({
  name: String,
  description: String,
  category: String
});

var Chat = mongoose.model("Chat", chatSchema);

exports.default = Chat;