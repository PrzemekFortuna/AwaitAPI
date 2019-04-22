const mongoose = require('mongoose');
let Schema = mongoose.Schema;

var restaurant = mongoose.Schema({
   name: { type: Schema.Types.String, require: true},   
   location: {type: Schema.Types.ObjectId, ref:'Location'},
   user: {type: Schema.Types.ObjectId, ref: 'User'}
});

module.exports = mongoose.model("Restaurant", restaurant);