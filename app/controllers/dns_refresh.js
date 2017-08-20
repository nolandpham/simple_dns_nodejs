'use trict'

module.exports = function ( request, reply) {
	var time = new Date().toISOString()
					 .replace(/\..+/, '')
					 .replace(/(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})/, '[$3-$2-$1 $4:$5:$6]');
	request.query.new_ip = request.info.remoteAddress;
	console.log( time + "[INFO]" + request.info.remoteAddress + " call API: dns_refresh: (", request.query, ")");

	// validating
	if( !request.query.hub_token) {
		console.log( "The hub token field is required.");
		reply( '[FALSE]');
		return;
	}
	if( request.query.hub_token.length != 16) {
		console.log( "The hub token must be 16 characters.");
		reply( '[FALSE]');
		return;
	}

	if( !request.query.mac) {
		console.log( "The mac field is required.");
		reply( '[FALSE]');
		return;
	}
	var mac_format = /^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/;
	if( !mac_format.test( request.query.mac)) {
		console.log( "The mac field wrong format.");
		reply( '[FALSE]');
		return;
	}

	if( !request.query.new_ip) {
		console.log( "The New IP field is required.");
		reply( '[FALSE]');
		return;
	}
	var ip_format = /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/;
	if( !ip_format.test( request.query.new_ip)) {
		console.log( "The New IP field wrong format.");
		reply( '[FALSE]');
		return;
	}

	if( !request.query.status) {
		console.log( "The Status field is required.");
		reply( '[FALSE]');
		return;
	}
	var status_format = /^[123]$/;
	if( !status_format.test( request.query.status)) {
		console.log( "The Status field wrong format.");
		reply( '[FALSE]');
		return;
	}

	var Hub = require( '../models/hub');
	if( request.query.status == 1) {
		console.log("Activing hub....");
		// check token exists
		Hub.find(
		{
			is_deleted: 0,
			mac: request.query.mac,
			hub_token: request.query.hub_token
		}, function(err, hub_exists) {
			if( err) {
				console.log( "False when connect database.")
				console.log( err);
			} else {
				if( hub_exists.length == 0) {
					// remove old hubs
					Hub.find(
					{ 
						is_deleted: 0,
						mac: request.query.mac,
					}, 
					function( err, old_hubs) {
						if( err) {
							console.log( "False when connect database.")
							console.log( err);
						} else {
							// remove old hubs.
							if( old_hubs !== undefined && old_hubs.length > 0) {
								console.log("Found " + old_hubs.length + " old hubs. Deleting ...");
								for (var i = old_hubs.length - 1; i >= 0; i--) {
									old_hubs[i].is_deleted = 1;
									old_hubs[i].save();
								}
							}

							// console.log("Insert new hub");
							Hub.findOne(
							{
								is_deleted: 0,
								hub_token: request.query.hub_token,
							}, 
							function( err, hub) {
								if( err) {
									console.log( "False when connect database.")
									console.log( err);
								} else {
									if( hub.mac == null) {
										hub.mac = request.query.mac;
										hub.ip = request.query.new_ip;
										hub.save();
						
										console.log( "Response: [OK].");
										reply( '[OK]');
									} else {
										console.log( "Hub exists. Can\'t active again!");
										reply( '[FALSE]');
									}
								}
							});
						}
					});
				} else {
					console.log( "Hub exists. Can\'t active again!");
					reply( '[FALSE]');
				}
			}
		});
	}
	else {
		console.log("Refresh DNS....");
		Hub.findOne(
		{
			is_deleted: 0,
			mac: request.query.mac,
			hub_token: request.query.hub_token,
		}, 
		function( err, hub) {
			if( err) {
				console.log( "False when connect database.")
				console.log( err);
			} else {
				if( hub) {
					hub.ip = request.query.new_ip;
					hub.save();
	
					console.log( "Response: [OK].");
					reply( '[OK]');
				} else {
					console.log( "Hub not found. Or mac+token not match!");
					reply( '[FALSE]');
				}
			}
		});
	}
}
