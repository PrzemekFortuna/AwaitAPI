const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const statuses = require('./order-statuses');

let order = mongoose.Schema({
    number: { type: Schema.Types.Number, require: true },
    status: {
        type: Schema.Types.Number,
        require: true,
        enum: [statuses.new, statuses.inprogress, statuses.ready, statuses.finalised]
    },
    note: { type: Schema.Types.String },
    restaurant: { type: Schema.Types.ObjectId, ref: 'Restaurant', require: true },
    user: { type: Schema.Types.ObjectId, ref: 'User' }
});

module.exports = mongoose.model('Order', order);