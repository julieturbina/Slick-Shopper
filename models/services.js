const mongoose = require("mongoose");
const Schema   = mongoose.Schema;
const ObjectId = Schema.ObjectId;

//login with facebook below
const servicesSchema = new Schema({
  service: String,
  reviews: [
    {
  user: String,
  email: String
    }
  ]

});

// use schema below =======

const Services = mongoose.model("Services", servicesSchema);

module.exports = Services;