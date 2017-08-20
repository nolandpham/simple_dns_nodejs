'use trict'

module.exports = function ( request, reply) {
	var time = new Date().toISOString()
					 .replace(/\..+/, '')
					 .replace(/(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})/, '[$3-$2-$1 $4:$5:$6]');
	console.log( time + "[INFO]" + request.info.remoteAddress + " call API: get_ip: (", request.query, ")");

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
			console.log( "False when connect database.");
			reply( {"status":500,"content": err});
			return;
		}
		if( !hub) {
			console.log( "Hub token not found.");
			reply( {"status":500,"content":{"hub_token":["The selected hub token is invalid. Not found"]}});// Hub not found.
			return;
		}
		if( hub.is_deleted) {
			console.log( "Hub token was deleted.");
			reply( {"status":500,"content":{"hub_token":["The selected hub token is invalid. deleted"]}});// Hub is deleted.
			return;
		}
		if( !hub.mac || hub.mac == 'NULL') {
			console.log( "Hub token not actived.");
			reply( {"status":500,"content":{"error":"Hub not actived!"}});// Hub doesn't active.
			return;
		}

		console.log( "Response: " + hub.ip);
		reply( {"status":200,"content":{"ip":hub.ip}});
	});
}
