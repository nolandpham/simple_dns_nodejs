'use trict'


const config = require( './config');

var mongoose   = require('mongoose');
console.log( config.db.getUrl());
mongoose.connect( config.db.getUrl());

module.exports = mongoose.connection;