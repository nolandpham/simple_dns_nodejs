'use trict'

var setup_hub_controller = function(request, reply) {
    // validating
    if (!request.query.hub_token) {
        request.log('warning', "The hub token field is required.");
        reply({ "status": 500, "content": { "hub_token": ["The hub token field is required."] } });
        return;
    }
    if (request.query.hub_token.length != 16) {
        request.log('warning', "The hub token must be 16 characters.");
        reply({ "status": 500, "content": { "hub_token": ["The hub token must be 16 characters."] } });
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
                reply({ "status": 500, "content": err });
                return;
            }
            if (hub) {
                request.log('warning', "Hub token exists.");
                reply({ "status": 500, "content": { "error": "Hub Token exists." } }); // Hub token exists.
                return;
            }

            var hub = new Hub({ hub_token: request.query.hub_token });
            hub.save();

            request.log('info', "Response: Done.");
            reply({ "status": 200, "content": { "message": "Done" } });
        });
}
module.exports = setup_hub_controller;
