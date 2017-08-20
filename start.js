'use trict'

var app = require('./app');
app.start( function( err) {
	if( err) {
		throw err;
	}
	console.log( `Server running... \n At: ${app.info.uri}`);
});