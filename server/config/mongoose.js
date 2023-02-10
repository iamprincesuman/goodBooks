const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/goodBooks_development');
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Error in connecting to MongoDB'));
db.once('open', function(){
    console.log('connected to the database ::  MongoDB');
});
module.exports = db;