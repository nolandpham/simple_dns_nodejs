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
        type: Number,
        default: 0
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
    online: function() {},
    offline: function() {

    },
    actived: function() {

    },
    active: function() {

    },
    delete: function() {

    },
    print: function() {
        var server = require('../../app');
        server.log('info', '%s: (%s-%s-%d)', this._id, this.mac, this.ip, this.is_deleted);
    }
});

hubSchema.static({
    printAll: function() {
        var server = require('../../app');
        server.log('info', "Print node: ");
        this.find(function(err, result) {
            if (err) server.log('info', err);
            if (typeof(result) == 'object') {
                result.forEach(function(node) {
                    server.log('info', '%s: (%s-%d-%d)', node._id, node.mac, node.ip, node.is_deleted);
                })
            } else {
                server.log('info', result);
            }
        });
    }
});

var Hub = mongoose.model("Hub", hubSchema);

module.exports = Hub;
