'use trict'

var config = {
	api_server: {
		port: 3001,
		host: 'localhost'
	},
	db: {
		host: 'localhost',
		name: 'simple_dns_nodejs',
		port: 32768,

		getUrl: function () {
			var url = 'mongodb://';
			return url + this.host + (this.port?( ':' + this.port):'') + '/' + this.name;
		}
	}
};

module.exports = config;