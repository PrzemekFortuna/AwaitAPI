const mongoose = require('mongoose');
let Schema = mongoose.Schema;

var restaurant = mongoose.Schema({
   Name: { type: Schema.Types.String, require: true},
   Email: {type: Schema.Types.String},
   Location: {type: Schema.Types.ObjectId, ref:'Location'},
   Password: {type: Schema.Types.String, require: true}
});

module.exports = mongoose.model("Restaurant", restaurant);