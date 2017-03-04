'use trict'

module.exports = function ( server) {
	var Joi = require( 'joi');
	var controllers = [
		{
			method: 'GET',
			path: '/',
			handler: require('./controllers/index')
		},
		{
			method: 'GET',
			path: '/get_ip',
			handler: require('./controllers/get_ip'),
		    // config: {
		    //     validate: {
		    //         query: {
		    //             hub_token: Joi.string().alphanum().length(16).required()
		    //         }
		    //     }
		    // }
		},
		{
			method: 'GET',
			path: '/setup_hub',
			handler: require('./controllers/setup_hub')
		},
		{
			method: 'GET',
			path: '/dns_refresh',
			handler: require('./controllers/dns_refresh')
		},
		{
			method: 'GET',
			path: '/{p*}', // catch all path
			handler: require( './controllers/index')
		}
	];

	// begin register
	for (var i = controllers.length - 1; i >= 0; i--) {
		server.route( controllers[i]);
	}
};
