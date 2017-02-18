'use trict'
// db.hubs.insert({mac:'11:22:33:44:55:66',ip:'123.456.789.012',hub_token:'c22e1e3a78e7ddda', is_deleted:0,created_at:Date.now(),updated_at:Date.now()});

var mongoose = require("mongoose");
var Schema = mongoose.Schema,
	ObjectId = Schema.ObjectId;

var hubSchema = new Schema({
	// _id: {
	// 	type: String
	// },
	mac: {
		type: String,
		lowercase: true,
		length: 17
	},
	ip: {
		type: String,
		lowercase: true,
		length: 15
	},
	hub_token: {
		type: String,
		lowercase: true,
		length: 16
	},
	is_deleted: {
		type: Boolean,
		default: false
	},
	created_at: {
		type: Date,
		default: Date.now()
	},
	updated_at: {
		type: Date,
		default: Date.now()
	}
});

hubSchema.method({
	online: function() {
		console.log( this);
	},
	offline: function() {

	},
	actived: function() {

	},
	active: function() {

	},
	delete: function() {

	},
	print: function() {
		console.log( '%s: (%s-%s-%d)', this._id, this.mac, this.ip, this.is_deleted);
	}
});

hubSchema.static({
	printAll: function() {
		console.log( "Print node: ");
		this.find(function( err, result) {
			if( err) console.log( err);
			if( typeof( result) == 'object') {
				result.forEach( function( node) {
					console.log( '%s: (%s-%d-%d)', node._id, node.mac, node.ip, node.is_deleted);
				})
			} else {
				console.log( result);
			}
		});
	}
});

var Hub = mongoose.model( "Hub", hubSchema);

module.exports = Hub;