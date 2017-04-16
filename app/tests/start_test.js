'use trict'

var assert = require('assert');
var request = require('superagent');
const config = require( '../config');
var mongoose = require('mongoose');
mongoose.connect( config.db.getUrl());
var extend = require('util')._extend;

var host = "http://localhost:3000";
// var host = "http://dns.ora.vn";

function refresh_database( done) {
    var Hub = require( '../models/hub');
    Hub.remove({}, function( err) {
        if( err) {
            console.log( err);
        } else {
            try {
                var default_hub = { 
                    mac:'11:22:33:44:55:66',
                    ip:'123.456.789.012',
                    hub_token:'defaulthub123456', 
                    is_deleted:false,
                    created_at:Date.now(),
                    updated_at:Date.now()
                };

                var actived_hub = extend( {}, default_hub);
                actived_hub.hub_token = 'activedhub123456';
                var hub = new Hub( actived_hub);
                hub.save();

                var deleted_hub = extend( {}, default_hub);
                deleted_hub.is_deleted = true;
                deleted_hub.hub_token = 'deletedhub123456';
                var hub = new Hub( deleted_hub);
                hub.save();

                var inactive_hub = extend( {}, default_hub);
                inactive_hub.mac = '';
                inactive_hub.ip = '';
                inactive_hub.hub_token = 'inactivehub12345';
                var hub = new Hub( inactive_hub);
                hub.save();

                done();
            } catch( e) {
                console.log( e);
            }
        }
    });
}

describe('server', function() {

    it('Server Working...', function(done) {
        request
            .get( host + '/')
            .end( function(error, res) {
                assert.ifError(error);
                done();
            });
    });
});

describe('get_ip', function() {
    beforeEach( function( done) {
        refresh_database( done);
    });
 
    it('hub_token empty.', function(done) {
        request
            .get( host + '/get_ip?hub_token=')
            .end( function(error, res) {
                assert.ifError( error);
                assert.equal( res.status, 200);
                assert.equal( res.body.status, 500);
                done();
            });
    });
 
    it('hub_token not fount.', function(done) {
        request
            .get( host + '/get_ip')
            .end( function(error, res) {
                assert.ifError( error);
                assert.equal( res.status, 200);
                assert.equal( res.body.status, 500);
                done();
            });
    });
    it('hub_token min length.', function(done) {
        request
            .get( host + '/get_ip?hub_token=asdf')
            .end( function(error, res) {
                assert.ifError( error);
                assert.equal( res.status, 200);
                assert.equal( res.body.status, 500);
                done();
            });
    });
    it('hub_token max length.', function(done) {
        request
            .get( host + '/get_ip?hub_token=12345678901234567')
            .end( function(error, res) {
                assert.ifError( error);
                assert.equal( res.status, 200);
                assert.equal( res.body.status, 500);
                done();
            });
    });
    it('Hub invalid.', function(done) {
        request
            .get( host + '/get_ip?hub_token=hubnotfound12345')
            .end( function(error, res) {
                assert.ifError( error);
                assert.equal( res.status, 200);
                assert.equal( res.body.status, 500);
                done();
            });
    });
    it('Get hub inactived.', function(done) {
        request
            .get( host + '/get_ip?hub_token=inactivehub12345')
            .end( function(error, res) {
                assert.ifError( error);
                assert.equal( res.status, 200);
                assert.equal( res.body.status, 500);
                done();
            });
    });
    it('Get hub actived.', function(done) {
        request
            .get( host + '/get_ip?hub_token=activedhub123456')
            .end( function(error, res) {
                assert.ifError( error);
                assert.equal( res.status, 200);
                assert.equal( res.body.status, 200);
                assert.equal( res.body.content.ip, "123.456.789.012");
                done();
            });
    });
});

describe('setup_hub', function() {
    beforeEach( function( done) {
        refresh_database( done);
    });
 
    it('hub_token empty.', function(done) {
        request
            .get( host + '/setup_hub?hub_token=')
            .end( function(error, res) {
                assert.ifError( error);
                assert.equal( res.status, 200);
                assert.equal( res.body.status, 500);
                done();
            });
    });
 
    it('hub_token not fount.', function(done) {
        request
            .get( host + '/setup_hub')
            .end( function(error, res) {
                assert.ifError( error);
                assert.equal( res.status, 200);
                assert.equal( res.body.status, 500);
                done();
            });
    });
    it('hub_token min length.', function(done) {
        request
            .get( host + '/setup_hub?hub_token=asdf')
            .end( function(error, res) {
                assert.ifError( error);
                assert.equal( res.status, 200);
                assert.equal( res.body.status, 500);
                done();
            });
    });
    it('hub_token max length.', function(done) {
        request
            .get( host + '/setup_hub?hub_token=12345678901234567')
            .end( function(error, res) {
                assert.ifError( error);
                assert.equal( res.status, 200);
                assert.equal( res.body.status, 500);
                done();
            });
    });
    it('setup duplicate hub inactived.', function(done) {
        request
            .get( host + '/setup_hub?hub_token=inactivehub12345')
            .end( function(error, res) {
                assert.ifError( error);
                assert.equal( res.status, 200);
                assert.equal( res.body.status, 500);
                done();
            });
    });
    it('setup duplicate hub actived.', function(done) {
        request
            .get( host + '/setup_hub?hub_token=activedhub123456')
            .end( function(error, res) {
                assert.ifError( error);
                assert.equal( res.status, 200);
                assert.equal( res.body.status, 500);
                done();
            });
    });
    it('setup success.', function(done) {
        request
            .get( host + '/setup_hub?hub_token=newhub1234567890')
            .end( function(error, res) {
                assert.ifError( error);
                assert.equal( res.status, 200);
                assert.equal( res.text, '{"status":200,"content":{"message":"Done"}}');
                done();
            });
    });
});

describe('dns_refresh', function() {
    beforeEach( function( done) {
        refresh_database( done);
    });
 
    it('ok', function(done) {
        request
            .get( host + '/dns_refresh?hub_token=1e4a5e7bc6df361d&mac=aa:bb:cc:dd:ee:ff&new_ip=123.456.782.1&status=1')
            .end( function(error, res) {
                assert.ifError(error);
                assert.equal( res.text, '[FALSE]');
                done();
            });
    });
 
    it('hub_token empty', function(done) {
        request
            .get( host + '/dns_refresh?hub_token=&mac=aa:bb:cc:dd:ee:ff&new_ip=123.456.782.1&status=1')
            .end( function(error, res) {
                assert.ifError(error);
                assert.equal( res.text, '[FALSE]');
                done();
            });
    });
 
    it('hub_token not found', function(done) {
        request
            .get( host + '/dns_refresh?mac=aa:bb:cc:dd:ee:ff&new_ip=123.456.782.1&status=1')
            .end( function(error, res) {
                assert.ifError(error);
                assert.equal( res.text, '[FALSE]');
                done();
            });
    });
 
    it('hub_token more than 16 characters', function(done) {
        request
            .get( host + '/dns_refresh?hub_token=12345678901234567&mac=aa:bb:cc:dd:ee:ff&new_ip=123.456.782.1&status=1')
            .end( function(error, res) {
                assert.ifError(error);
                assert.equal( res.text, '[FALSE]');
                done();
            });
    });
 
    it('hub_token less than 16 characters', function(done) {
        request
            .get( host + '/dns_refresh?hub_token=123456789012345&mac=aa:bb:cc:dd:ee:ff&new_ip=123.456.782.1&status=1')
            .end( function(error, res) {
                assert.ifError(error);
                assert.equal( res.text, '[FALSE]');
                done();
            });
    });
 
    it('mac empty', function(done) {
        request
            .get( host + '/dns_refresh?hub_token=inactivehub12345&mac=&new_ip=123.456.782.1&status=1')
            .end( function(error, res) {
                assert.ifError(error);
                assert.equal( res.text, '[FALSE]');
                done();
            });
    });
 
    it('mac not found', function(done) {
        request
            .get( host + '/dns_refresh?hub_token=inactivehub12345&new_ip=123.456.782.1&status=1')
            .end( function(error, res) {
                assert.ifError(error);
                assert.equal( res.text, '[FALSE]');
                done();
            });
    });
 
    it('mac wrong format 1', function(done) {
        request
            .get( host + '/dns_refresh?hub_token=inactivehub12345&mac=aa&new_ip=123.456.782.1&status=1')
            .end( function(error, res) {
                assert.ifError(error);
                assert.equal( res.text, '[FALSE]');
                done();
            });
    });
 
    it('mac wrong format 2', function(done) {
        request
            .get( host + '/dns_refresh?hub_token=inactivehub12345&mac=1234&new_ip=123.456.782.1&status=1')
            .end( function(error, res) {
                assert.ifError(error);
                assert.equal( res.text, '[FALSE]');
                done();
            });
    });
 
    it('mac wrong format 3', function(done) {
        request
            .get( host + '/dns_refresh?hub_token=inactivehub12345&mac=aa.bb:cc:dd:ee:ff&new_ip=123.456.782.1&status=1')
            .end( function(error, res) {
                assert.ifError(error);
                assert.equal( res.text, '[FALSE]');
                done();
            });
    });
 
    it('mac wrong format 4', function(done) {
        request
            .get( host + '/dns_refresh?hub_token=inactivehub12345&mac=a//:bb:cc:dd:ee:ff&new_ip=123.456.782.1&status=1')
            .end( function(error, res) {
                assert.ifError(error);
                assert.equal( res.text, '[FALSE]');
                done();
            });
    });
 
    it('mac wrong format 5', function(done) {
        request
            .get( host + '/dns_refresh?hub_token=inactivehub12345&mac=aa:bb:cc:dd:ee:ff:11&new_ip=123.456.782.1&status=1')
            .end( function(error, res) {
                assert.ifError(error);
                assert.equal( res.text, '[FALSE]');
                done();
            });
    });
 
    it('mac wrong format 6', function(done) {
        request
            .get( host + '/dns_refresh?hub_token=inactivehub12345&mac=aa/-bb/-cc/-dd/-ee:ff&new_ip=123.456.782.1&status=1')
            .end( function(error, res) {
                assert.ifError(error);
                assert.equal( res.text, '[FALSE]');
                done();
            });
    });
 
    it('mac wrong format 7', function(done) {
        request
            .get( host + '/dns_refresh?hub_token=inactivehub12345&mac=aa,bb,cc,dd,ee,ff&new_ip=123.456.782.1&status=1')
            .end( function(error, res) {
                assert.ifError(error);
                assert.equal( res.text, '[FALSE]');
                done();
            });
    });
 
    // it('new_ip empty', function(done) {
    //     request
    //         .get( host + '/dns_refresh?hub_token=inactivehub12345&mac=aa:bb:cc:dd:ee:ff&new_ip=&status=1')
    //         .end( function(error, res) {
    //             assert.ifError(error);
    //             assert.equal( res.text, '[FALSE]');
    //             done();
    //         });
    // });
 
    // it('new_ip not found', function(done) {
    //     request
    //         .get( host + '/dns_refresh?hub_token=inactivehub12345&mac=aa:bb:cc:dd:ee:ff&status=1')
    //         .end( function(error, res) {
    //             assert.ifError(error);
    //             assert.equal( res.text, '[FALSE]');
    //             done();
    //         });
    // });
 
    // it('new_ip wrong format 1', function(done) {
    //     request
    //         .get( host + '/dns_refresh?hub_token=inactivehub12345&mac=aa:bb:cc:dd:ee:ff&new_ip=aaa.456.782.1&status=1')
    //         .end( function(error, res) {
    //             assert.ifError(error);
    //             assert.equal( res.text, '[FALSE]');
    //             done();
    //         });
    // });
 
    // it('new_ip wrong format 2', function(done) {
    //     request
    //         .get( host + '/dns_refresh?hub_token=inactivehub12345&mac=aa:bb:cc:dd:ee:ff&new_ip=456.782.1&status=1')
    //         .end( function(error, res) {
    //             assert.ifError(error);
    //             assert.equal( res.text, '[FALSE]');
    //             done();
    //         });
    // });
 
    // it('new_ip wrong format 3', function(done) {
    //     request
    //         .get( host + '/dns_refresh?hub_token=inactivehub12345&mac=aa:bb:cc:dd:ee:ff&new_ip=123.456.782.1.4&status=1')
    //         .end( function(error, res) {
    //             assert.ifError(error);
    //             assert.equal( res.text, '[FALSE]');
    //             done();
    //         });
    // });
 
    it('status empty', function(done) {
        request
            .get( host + '/dns_refresh?hub_token=inactivehub12345&mac=aa:bb:cc:dd:ee:ff&new_ip=123.456.782.1&status=')
            .end( function(error, res) {
                assert.ifError(error);
                assert.equal( res.text, '[FALSE]');
                done();
            });
    });
 
    it('status not found', function(done) {
        request
            .get( host + '/dns_refresh?hub_token=inactivehub12345&mac=aa:bb:cc:dd:ee:ff&new_ip=123.456.782.1')
            .end( function(error, res) {
                assert.ifError(error);
                assert.equal( res.text, '[FALSE]');
                done();
            });
    });
 
    it('status not in [0,1,2] 1', function(done) {
        request
            .get( host + '/dns_refresh?hub_token=inactivehub12345&mac=aa:bb:cc:dd:ee:ff&new_ip=123.456.782.1&status=-1')
            .end( function(error, res) {
                assert.ifError(error);
                assert.equal( res.text, '[FALSE]');
                done();
            });
    });
 
    it('status not in [0,1,2] 2', function(done) {
        request
            .get( host + '/dns_refresh?hub_token=inactivehub12345&mac=aa:bb:cc:dd:ee:ff&new_ip=123.456.782.1&status=3')
            .end( function(error, res) {
                assert.ifError(error);
                assert.equal( res.text, '[FALSE]');
                done();
            });
    });
 
    it('status not in [0,1,2] 3', function(done) {
        request
            .get( host + '/dns_refresh?hub_token=inactivehub12345&mac=aa:bb:cc:dd:ee:ff&new_ip=123.456.782.1&status=9')
            .end( function(error, res) {
                assert.ifError(error);
                assert.equal( res.text, '[FALSE]');
                done();
            });
    });
 
    it('dns_refresh ok status 0', function(done) {
        request
            .get( host + '/dns_refresh?hub_token=inactivehub12345&mac=aa:bb:cc:dd:ee:ff&new_ip=098.765.432.1&status=0')
            .end( function(error, res) {
                assert.ifError(error);
                assert.equal( res.text, '[OK]');
                done();
            });
    });
 
    it('dns_refresh ok status 1', function(done) {
        request
            .get( host + '/dns_refresh?hub_token=inactivehub12345&mac=aa:bb:cc:dd:ee:ff&new_ip=098.765.432.1&status=1')
            .end( function(error, res) {
                assert.ifError(error);
                assert.equal( res.text, '[OK]');
                done();
            });
    });
 
    it('dns_refresh ok status 2', function(done) {
        request
            .get( host + '/dns_refresh?hub_token=inactivehub12345&mac=aa:bb:cc:dd:ee:ff&new_ip=098.765.432.1&status=2')
            .end( function(error, res) {
                assert.ifError(error);
                assert.equal( res.text, '[OK]');
                done();
            });
    });
});

describe('integration test', function() {
    beforeEach( function( done) {
        refresh_database( done);
    });
 
    it('create new hub and active it', function(done) {
        // create
        request
            .get( host + '/setup_hub?hub_token=newhub1234567890')
            .end( function(error, res) {
                assert.ifError( error);
                assert.equal( res.status, 200);
                assert.equal( res.text, '{"status":200,"content":{"message":"Done"}}');

                // active
                request
                    .get( host + '/dns_refresh?hub_token=newhub1234567890&mac=aa:bb:cc:dd:ee:ff&new_ip=098.765.432.1&status=0')
                    .end( function(error, res) {
                        assert.ifError( error);
                        assert.equal( res.status, 200);
                        assert.equal( res.text, '[OK]');

                        // check new ip
                        request
                            .get( host + '/get_ip?hub_token=newhub1234567890')
                            .end( function(error, res) {
                                assert.ifError( error);
                                assert.equal( res.status, 200);
                                assert.equal( res.body.status, 200);
                                assert.equal( res.body.content.ip, '098.765.432.1');
                                done();
                            });
                    });
            });
    });
 
    it('active old hub', function(done) {
        request
            .get( host + '/dns_refresh?hub_token=inactivehub12345&mac=aa:bb:cc:dd:ee:ff&new_ip=098.765.432.1&status=1')
            .end( function(error, res) {
                assert.ifError( error);
                assert.equal( res.status, 200);
                assert.equal( res.text, '[OK]');

                // check IP
                request
                    .get( host + '/get_ip?hub_token=inactivehub12345')
                    .end( function(error, res) {
                        assert.ifError( error);
                        assert.equal( res.status, 200);
                        assert.equal( res.body.status, 200);
                        assert.equal( res.body.content.ip, '098.765.432.1');
                        done();
                    });
            });
    });
 
    it('change IP', function(done) {
        // check old ip
        request
            .get( host + '/get_ip?hub_token=activedhub123456')
            .end( function(error, res) {
                assert.ifError( error);
                assert.equal( res.status, 200);
                assert.equal( res.body.status, 200);
                assert.equal( res.body.content.ip, '123.456.789.012');

                // active
                request
                    .get( host + '/dns_refresh?hub_token=activedhub123456&mac=aa:bb:cc:dd:ee:ff&new_ip=098.765.432.1&status=1')
                    .end( function(error, res) {
                        assert.ifError( error);
                        assert.equal( res.status, 200);
                        assert.equal( res.text, '[OK]');

                        // check new ip
                        request
                            .get( host + '/get_ip?hub_token=activedhub123456')
                            .end( function(error, res) {
                                assert.ifError( error);
                                assert.equal( res.status, 200);
                                assert.equal( res.body.status, 200);
                                assert.equal( res.body.content.ip, '098.765.432.1');
                                done();
                            });
                    });
            });
    });
 
    it('create new hub, active, change ip', function(done) {
        // create
        request
            .get( host + '/setup_hub?hub_token=newhub1234567890')
            .end( function(error, res) {
                assert.ifError( error);
                assert.equal( res.status, 200);
                assert.equal( res.text, '{"status":200,"content":{"message":"Done"}}');

                // active
                request
                    .get( host + '/dns_refresh?hub_token=newhub1234567890&mac=aa:bb:cc:dd:ee:ff&new_ip=098.765.432.1&status=0')
                    .end( function(error, res) {
                        assert.ifError( error);
                        assert.equal( res.status, 200);
                        assert.equal( res.text, '[OK]');

                        // check actived ip
                        request
                            .get( host + '/get_ip?hub_token=newhub1234567890')
                            .end( function(error, res) {
                                assert.ifError( error);
                                assert.equal( res.status, 200);
                                assert.equal( res.body.status, 200);
                                assert.equal( res.body.content.ip, '098.765.432.1');

                                // update new IP
                                request
                                    .get( host + '/dns_refresh?hub_token=newhub1234567890&mac=aa:bb:cc:dd:ee:ff&new_ip=123.456.789.012&status=1')
                                    .end( function(error, res) {
                                        assert.ifError( error);
                                        assert.equal( res.status, 200);
                                        assert.equal( res.text, '[OK]');

                                        // check new ip
                                        request
                                            .get( host + '/get_ip?hub_token=newhub1234567890')
                                            .end( function(error, res) {
                                                assert.ifError( error);
                                                assert.equal( res.status, 200);
                                                assert.equal( res.body.status, 200);
                                                assert.equal( res.body.content.ip, '123.456.789.012');
                                                done();
                                            });
                                    });
                            });
                    });
            });
    });
 
    it('create new hub, active, change ip by restart, change ip by waiter', function(done) {
        // create
        request
            .get( host + '/setup_hub?hub_token=newhub1234567890')
            .end( function(error, res) {
                assert.ifError( error);
                assert.equal( res.status, 200);
                assert.equal( res.text, '{"status":200,"content":{"message":"Done"}}');

                // active
                request
                    .get( host + '/dns_refresh?hub_token=newhub1234567890&mac=aa:bb:cc:dd:ee:ff&new_ip=098.765.432.1&status=0')
                    .end( function(error, res) {
                        assert.ifError( error);
                        assert.equal( res.status, 200);
                        assert.equal( res.text, '[OK]');

                        // check actived ip
                        request
                            .get( host + '/get_ip?hub_token=newhub1234567890')
                            .end( function(error, res) {
                                assert.ifError( error);
                                assert.equal( res.status, 200);
                                assert.equal( res.body.status, 200);
                                assert.equal( res.body.content.ip, '098.765.432.1');

                                // update new IP
                                request
                                    .get( host + '/dns_refresh?hub_token=newhub1234567890&mac=aa:bb:cc:dd:ee:ff&new_ip=123.456.789.012&status=1')
                                    .end( function(error, res) {
                                        assert.ifError( error);
                                        assert.equal( res.status, 200);
                                        assert.equal( res.text, '[OK]');

                                        // check new ip 1
                                        request
                                            .get( host + '/get_ip?hub_token=newhub1234567890')
                                            .end( function(error, res) {
                                                assert.ifError( error);
                                                assert.equal( res.status, 200);
                                                assert.equal( res.body.status, 200);
                                                assert.equal( res.body.content.ip, '123.456.789.012');

                                                // update new IP
                                                request
                                                    .get( host + '/dns_refresh?hub_token=newhub1234567890&mac=aa:bb:cc:dd:ee:ff&new_ip=456.123.789.012&status=2')
                                                    .end( function(error, res) {
                                                        assert.ifError( error);
                                                        assert.equal( res.status, 200);
                                                        assert.equal( res.text, '[OK]');

                                                        // check new ip
                                                        request
                                                            .get( host + '/get_ip?hub_token=newhub1234567890')
                                                            .end( function(error, res) {
                                                                assert.ifError( error);
                                                                assert.equal( res.status, 200);
                                                                assert.equal( res.body.status, 200);
                                                                assert.equal( res.body.content.ip, '456.123.789.012');
                                                                done();
                                                            });
                                                    });
                                            });
                                    });
                            });
                    });
            });
    });
 
    it('create new hub, active it, get ip. Setup this hub again, active it, get new ip', function(done) {
        // create 1
        request
            .get( host + '/setup_hub?hub_token=newhub1234567890')
            .end( function(error, res) {
                assert.ifError( error);
                assert.equal( res.status, 200);
                assert.equal( res.text, '{"status":200,"content":{"message":"Done"}}');

                // active
                request
                    .get( host + '/dns_refresh?hub_token=newhub1234567890&mac=aa:bb:cc:dd:ee:ff&new_ip=098.765.432.1&status=0')
                    .end( function(error, res) {
                        assert.ifError( error);
                        assert.equal( res.status, 200);
                        assert.equal( res.text, '[OK]');

                        // check actived ip
                        request
                            .get( host + '/get_ip?hub_token=newhub1234567890')
                            .end( function(error, res) {
                                assert.ifError( error);
                                assert.equal( res.status, 200);
                                assert.equal( res.body.status, 200);
                                assert.equal( res.body.content.ip, '098.765.432.1');

                                // create 2
                                request
                                    .get( host + '/setup_hub?hub_token=newhub2234567890')
                                    .end( function(error, res) {
                                        assert.ifError( error);
                                        assert.equal( res.status, 200);
                                        assert.equal( res.text, '{"status":200,"content":{"message":"Done"}}');

                                        // active with old hub hardware.
                                        request
                                            .get( host + '/dns_refresh?hub_token=newhub2234567890&mac=aa:bb:cc:dd:ee:ff&new_ip=123.456.789.012&status=0')
                                            .end( function(error, res) {
                                                assert.ifError( error);
                                                assert.equal( res.status, 200);
                                                assert.equal( res.text, '[OK]');

                                                // check new ip
                                                request
                                                    .get( host + '/get_ip?hub_token=newhub2234567890')
                                                    .end( function(error, res) {
                                                        assert.ifError( error);
                                                        assert.equal( res.status, 200);
                                                        assert.equal( res.body.status, 200);
                                                        assert.equal( res.body.content.ip, '123.456.789.012');
                                                        done();
                                                    });
                                            });
                                    });
                            });
                    });
            });
    });
});