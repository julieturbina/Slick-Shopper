const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const providerSchema = new Schema({
    name: String,
    lastName: String,
    pictureUrl: String
});


const Provider = mongoose.model('Provider', providerSchema);

module.exports = Provider;
