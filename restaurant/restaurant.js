const mongoose = require('mongoose');
let Schema = mongoose.Schema;

//TODO: add Location
var restaurant = mongoose.Schema({
   Name: { type: Schema.Types.String, require: true},
   Email: {type: Schema.Types.String},
   Password: {type: Schema.Types.String, require: true}
});

module.exports = mongoose.model("Restaurant", restaurant);