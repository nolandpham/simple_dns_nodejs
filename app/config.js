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

        getUrl: function() {
            var url = 'mongodb://';
            return url + this.host + (this.port ? (':' + this.port) : '') + '/' + this.name;
        }
    },
    log: {
        register: require('good'),
        options: {
            ops: {
                interval: 1000
            },
            reporters: {
                myFileReporter: [{
                    module: 'good-squeeze',
                    name: 'Squeeze',
                    args: [{ request: '*', response: '*', log: '*', error: '*' }]
                }, {
                    module: 'good-squeeze',
                    name: 'SafeJson',
                    args: [
                        null,
                        { separator: ',' }
                    ]
                }, {
                    module: 'rotating-file-stream',
                    args: [
                        'current.log', {
                            compress: 'gzip',
                            size: '100K',
                            path: './logs'
                        }
                    ]
                }]
            }
        }
    }
};

module.exports = config;
