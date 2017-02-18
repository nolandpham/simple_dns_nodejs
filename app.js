'use trict'

const Hapi = require( 'hapi');
const config = require( './app/config');

var mongoose   = require('mongoose');
console.log( config.db.getUrl());
mongoose.connect( config.db.getUrl());

const server = new Hapi.Server();
server.connection( config.api_server);
require( './app/route')(server);

module.exports = server;