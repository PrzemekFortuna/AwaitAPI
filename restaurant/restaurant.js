const mongoose = require('mongoose');
let Schema = mongoose.Schema;

var restaurant = mongoose.Schema({
   name: { type: Schema.Types.String, require: true},
   email: {type: Schema.Types.String},
   location: {type: Schema.Types.ObjectId, ref:'Location'},
   password: {type: Schema.Types.String, require: true}
});

module.exports = mongoose.model("Restaurant", restaurant);