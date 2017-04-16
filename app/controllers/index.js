'use trict'
var index_controller = function ( request, reply) {
	var server = require( '../../app');
	server.log('info', 'Founded some unknow access from %s. Redirect to http://ora.vn', request.info.remoteAddress);
	reply.redirect("http://ora.vn");
};

module.exports = index_controller;
