var express = require('express');
var app = express();
var restaurant = require('./restaurant/restaurant');

const port = process.env.port || 3000;

var server = app.listen(port, () => {
    console.log('Server is running on port ', port);
});