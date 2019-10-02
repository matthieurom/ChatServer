var mongoose = require("mongoose");

// Define structure of our Messages
var messageSchema = new mongoose.Schema({
  text: String,
  date: Date,
  chat: { type: mongoose.Schema.Types.ObjectId, ref: "Chat" },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
});

const Chat = mongoose.model("Message", messageSchema);

exports.default = Chat;
