var mongoose = require('mongoose');
mongoose.set('useCreateIndex', true);
mongoose.set('useFindAndModify', false);
mongoose.connect('mongodb://localhost:27017/splitlocal', {useNewUrlParser: true})
.then(() => { console.log('Connected to MongoDB!')})
.catch(() => { console.log('Failed to connect to MongoDB!')});