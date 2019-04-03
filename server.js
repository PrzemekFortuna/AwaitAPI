var express = require('express');
var app = express();
var db = require('./db/db')
const port = process.env.port || 3000;

var server = app.listen(port, () => {
    console.log('Server is running on port ', port);
});