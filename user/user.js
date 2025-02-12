const mognoose = require('mongoose');
const Schema = mognoose.Schema;

const roles = require('./roles');

let user = Schema({
    name: { type: Schema.Types.String },
    lastname: { type: Schema.Types.String },
    role: {
        type: Schema.Types.String,
        required: true,
        enum: [roles.customer, roles.restaurant]
    },
    token: { type: Schema.Types.String },
    email: { type: Schema.Types.String, required: true },
    password: { type: Schema.Types.String, required: true }
});

module.exports = mognoose.model('User', user);