'use trict'

module.exports = function ( request, reply) {
	console.log( "Call API: setup_hub: (", request.query, ")");

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
		is_deleted:0,
		hub_token: request.query.hub_token
	}, 
	function( err, hub) {
		if( err) {
			reply( {"status":500,"content": err});
			return;
		}
		if( hub) {
			reply( {"status":500,"content":{"error":"Hub Token exists."}});// Hub token exists.
			return;
		}

		var hub = new Hub({hub_token: request.query.hub_token});
		hub.save();

		reply( {"status":200,"content":{"message":"Done"}});
	});
}