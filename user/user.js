const mognoose = require('mongoose');
const Schema = mognoose.Schema;

let user = Schema({
    name: { type: Schema.Types.String },
    lastname: { type: Schema.Types.String },
    role: { type: Schema.Types.String, require: true },
    email: { type: Schema.Types.String, require: true },
    password: { type: Schema.Types.String, require: true }
});

module.exports = mognoose.model('User', user);