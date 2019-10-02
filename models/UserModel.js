var mongoose = require("mongoose");

// Define structure of our Users
var userSchema = new mongoose.Schema({
  login: String,
  password: String,
  firstname: String,
  lastname: String
});

const User = mongoose.model("User", userSchema);

exports.default = User;
