'use trict'

var dns_refresh_controller = function(request, reply) {
    // store new IP
    request.query.new_ip = request.info.remoteAddress;
    // validating
    if (!request.query.hub_token) {
        request.log('warning', "The hub token field is required.");
        reply('[FALSE]');
        return;
    }
    if (request.query.hub_token.length != 16) {
        request.log('warning', "The hub token must be 16 characters.");
        reply('[FALSE]');
        return;
    }

    if (!request.query.mac) {
        request.log('warning', "The mac field is required.");
        reply('[FALSE]');
        return;
    }
    var mac_format = /^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/;
    if (!mac_format.test(request.query.mac)) {
        request.log('warning', "The mac field wrong format.");
        reply('[FALSE]');
        return;
    }

    if (!request.query.new_ip) {
        request.log('warning', "The New IP field is required.");
        reply('[FALSE]');
        return;
    }
    var ip_format = /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/;
    if (!ip_format.test(request.query.new_ip)) {
        request.log('warning', "The New IP field wrong format.");
        reply('[FALSE]');
        return;
    }

    if (!request.query.status) {
        request.log('warning', "The Status field is required.");
        reply('[FALSE]');
        return;
    }
    var status_format = /^[123]$/;
    if (!status_format.test(request.query.status)) {
        request.log('warning', "The Status field wrong format.");
        reply('[FALSE]');
        return;
    }

    var Hub = require('../models/hub');
    Hub.findOne({
            is_deleted: 0,
            hub_token: request.query.hub_token
        },
        function(err, hub) {
            if (err) {
                request.log('error', "False when connect database.");
                reply('[FALSE]');
                return;
            }
            if (hub) {
                if (!hub.mac || hub.mac == 'NULL') { // activing new hub
                    request.log('info', "Found new hub, activing....");
                    Hub.find({
                            is_deleted: 0,
                            mac: request.query.mac,
                            id: { $ne: hub.id }
                        },
                        function(err, old_hubs) {
                            if (err) {
                                request.log('error', "False when connect database.")
                            }

                            if (old_hubs !== undefined && old_hubs.length > 0) {
                                for (var i = old_hubs.length - 1; i >= 0; i--) {
                                    old_hubs[i].is_deleted = 1;
                                    old_hubs[i].save();
                                }
                            }
                            hub.mac = request.query.mac;
                            hub.save();
                        });
                }
                hub.ip = request.query.new_ip;
                hub.save();

                request.log('info', "Response: [OK].");
                reply('[OK]');
                return;
            }
            request.log('warning', "Hub token not found or that hub was deleted.");
            reply('[FALSE]');
        });
};
module.exports = dns_refresh_controller;
