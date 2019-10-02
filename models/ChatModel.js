var mongoose = require("mongoose");

// Define structure of our Chats
var chatSchema = new mongoose.Schema({
  name: String,
  description: String,
  category: String
});

const Chat = mongoose.model("Chat", chatSchema);

exports.default = Chat;
