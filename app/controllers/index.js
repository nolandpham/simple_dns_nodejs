'use trict'
var index_controller = function(request, reply) {
    request.log('securty', 'Founded some unknow access from ' + request.info.remoteAddress + '. Redirect to http://ora.vn');
    reply.redirect("http://ora.vn");
};

module.exports = index_controller;
