'use trict'

const Hapi = require('hapi');
const config = require('./app/config');

/// DB init
var mongoose = require('mongoose');
console.log('Connect db %s', config.db.getUrl());
mongoose.connect(config.db.getUrl());

/// Server init
const server = new Hapi.Server();
server.connection(config.api_server);
require('./app/route')(server);

/// Log init
server.register(config.log, function(err) {
    if (err) {
        console.log(err);
        throw err; // something bad happened loading the plugin
    }

    server.start(function() {

        server.log('info', 'Server running at: ' + server.info.uri);
    });
});

module.exports = server;
