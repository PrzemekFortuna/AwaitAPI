const mognoose = require('mongoose');
const Schema = mognoose.Schema;

const roles = require('./roles');

let user = Schema({
    name: { type: Schema.Types.String },
    lastname: { type: Schema.Types.String },
    role: {
        type: Schema.Types.String,
        require: true,
        enum: [roles.guest, roles.employee, roles.restaurant]
    },
    email: { type: Schema.Types.String, require: true },
    password: { type: Schema.Types.String, require: true }
});

module.exports = mognoose.model('User', user);