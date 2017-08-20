'use trict'

module.exports = function ( request, reply) {
	request.query.new_ip = request.info.remoteAddress;
	console.log( request.info.remoteAddress + " call API: timer: (", request.query, ")");

	var time = new Date().toISOString()
						 .replace(/\..+/, '')
						 .replace(/(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})/, '[$3$2$1$4$5$6]');
	reply( time);
}
