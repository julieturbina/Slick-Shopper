// models/user.js
const mongoose = require("mongoose");
const Schema   = mongoose.Schema;
//login with facebook below
const userSchema = new Schema({
  username: String,
  password: String,
  facebookID: String,
  googleID: String
}, {
  timestamps: { createdAt: "created_at", updatedAt: "updated_at" }
});


const User = mongoose.model("User", userSchema);

module.exports = User;