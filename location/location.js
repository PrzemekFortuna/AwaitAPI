const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let location = mongoose.Schema({
    city: { type: Schema.Types.String, require: true },
    address: { type: Schema.Types.String, require: true },
});

module.exports = mongoose.model('Location', location);