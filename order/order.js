const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let order = mongoose.Schema({
    number: { type: Schema.Types.Number, require: true},
    note: {type: Schema.Types.String },
    restaurant: { type: Schema.Types.ObjectId, ref: 'Restaurant'},
    user: { type: Schema.Types.ObjectId, ref: 'User'}
});

module.exports = mongoose.model('Order', order);