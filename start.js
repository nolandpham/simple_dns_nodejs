'use trict'

var app = require('./app');
app.start( function( err) {
	if( err) {
		throw err;
	}
	console.log( `Server running... \n At: ${app.info.uri}`);
});

// var Hub = require('./app/models/hub');
// var new_hub = new Hub({
// 	mac:'11:22:33:44:55:66',
// 	ip:'123.456.789.012',
// 	is_deleted:0,
// 	created_at:Date.now(),
// 	updated_at:Date.now()
// });
// new_hub.save();