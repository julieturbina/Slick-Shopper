const mongoose = require("mongoose");
const Schema   = mongoose.Schema;

//login with facebook below
const userSchema = new Schema({
  username: String,
  email: String,
  password: String,
  facebookID: String,
  googleID: String,
  // for provider/client
  isLaunderer: { type: Boolean, default: false },
fee: { type: Number, default: null }


// }, {
//   timestamps: { createdAt: "created_at", updatedAt: "updated_at" }
});

// use schema below =======
userSchema.set('timestamps', true);

const User = mongoose.model("User", userSchema);

module.exports = User;