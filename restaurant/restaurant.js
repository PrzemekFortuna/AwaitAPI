const mongoose = require('mongoose');
let Schema = mongoose.Schema;

var restaurant = mongoose.Schema({
   name: { type: Schema.Types.String, require: true},   
   city: { type: Schema.Types.String },
   zip: { type: Schema.Types.String },
   address: { type: Schema.Types.String },
   user: {type: Schema.Types.ObjectId, ref: 'User'}
});

module.exports = mongoose.model("Restaurant", restaurant);