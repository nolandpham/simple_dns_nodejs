'use trict'

const Hapi = require( 'hapi');
const config = require( './app/config');

var mongoose   = require('mongoose');
console.log( 'Connect db %s', config.db.getUrl());
mongoose.connect( config.db.getUrl());

const server = new Hapi.Server();
server.connection( config.api_server);
require( './app/route')(server);

server.register({
    register: require( 'good'),
    options: {
	    ops: {
	        interval: 1000
	    },
	    reporters: {
	        myFileReporter: [{
	            module: 'good-squeeze',
	            name: 'Squeeze',
	            args: [{ request: '*', response: '*', log:'*', error:'*'}]
	        }, {
	            module: 'good-squeeze',
	            name: 'SafeJson'
	        }, {
	            module: 'rotating-file-stream',
	            args: [
	            'current.log',
	            {
		            size: '100KB',
		            path: './logs'
		        }]
	        }]
	    }
	}
}, function (err) {

    if (err) {
    	console.log( err);
        throw err; // something bad happened loading the plugin
    }

    server.start(function () {

        server.log('info', 'Server running at: ' + server.info.uri);
    });
});

module.exports = server;