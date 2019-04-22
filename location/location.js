const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let location = mongoose.Schema({
    city: { type: Schema.Types.String, require: true },
    zip: { type: Schema.Types.Number, require: true },
    address: { type: Schema.Types.String, require: true },
    description: { type: Schema.Types.String }
});

module.exports = mongoose.model('Location', location);