const mongoose = require('mongoose');
const Types = mongoose.Schema.Types;

let number = mongoose.Schema({
    number: { type: Types.Number, require: true },
    date: { type: Types.Date },
    restaurant: { type: Types.ObjectId, ref: 'Restaurant', require: true }
});

module.exports = mongoose.model('Number', number);