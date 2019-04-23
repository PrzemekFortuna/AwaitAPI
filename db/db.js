var mongoose = require('mongoose');
const config = require('config');
mongoose.set('useCreateIndex', true);
mongoose.set('useFindAndModify', false);

let db = config.get('db');
mongoose.connect(db, {useNewUrlParser: true})
.then(() => { console.log(`Connected to MongoDB(${db})!`)})
.catch(() => { console.log(`Failed to connect to MongoDB(${db}!`)});