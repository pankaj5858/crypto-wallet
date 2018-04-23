
var mongoose = require('mongoose');

function DB(config){
    console.log(config.url)
    mongoose.connect(config.url);
    mongoose.connection.on('error', console.error.bind(console, 'An error ocurred with the DB connection: '));
}

module.exports = DB;

