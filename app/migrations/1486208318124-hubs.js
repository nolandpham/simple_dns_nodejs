'use strict'
// db.hubs.insert({mac:'11:22:33:44:55:66',ip:'123.456.789.012',is_deleted:0,created_at:Date.now,updated_at:Date.now});
var db = require('../db');

exports.up = function(next) {
	console.log( "Creating hubs table....");
	var Hub = require( '../models/hub');
	var hub1 = new Hub({
		mac: '11:22:33:44:55:66',
		ip: '123.456.789.012'
	});
	hub1.save();

    next();
};
exports.down = function(next) {
    next();
};