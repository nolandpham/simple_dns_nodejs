'use trict'

var get_ip_controller = function ( request, reply) {
	var server = require( '../../app');
	request.log('info',  request.info.remoteAddress + " call API: get_ip: ");

	// validating
	if( !request.query.hub_token) {
		reply( {"status":500,"content":{"hub_token":["The hub token field is required."]}});
		return;
	}
	if( request.query.hub_token.length != 16) {
		reply( {"status":500,"content":{"hub_token":["The hub token must be 16 characters."]}});
		return;
	}

	var Hub = require( '../models/hub');
	Hub.findOne(
	{ 
		is_deleted: 0,
		hub_token: request.query.hub_token
	}, 
	function( err, hub) {
		if( err) {
			request.log('info',  "False when connect database.");
			reply( {"status":500,"content": err});
			return;
		}
		if( !hub) {
			request.log('info',  "Hub token not found.");
			reply( {"status":500,"content":{"hub_token":["The selected hub token is invalid. Not found"]}});// Hub not found.
			return;
		}
		if( hub.is_deleted) {
			request.log('info',  "Hub token was deleted.");
			reply( {"status":500,"content":{"hub_token":["The selected hub token is invalid. deleted"]}});// Hub is deleted.
			return;
		}
		if( !hub.mac || hub.mac == 'NULL') {
			request.log('info',  "Hub token not actived.");
			reply( {"status":500,"content":{"error":"Hub not actived!"}});// Hub doesn't active.
			return;
		}

		request.log('info',  "Response: " + hub.ip);
		reply( {"status":200,"content":{"ip":hub.ip}});
	});
}
module.exports = get_ip_controller;