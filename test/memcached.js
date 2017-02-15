/**
 * @date 2017/2/15
 * @author xialeistudio<1065890063@qq.com>
 */
'use strict';
var config = require('./memcached.config');
var Memcached = require('../lib/memcached');
var memcached = new Memcached(config);
var mocha = require('mocha');
var assert = require('assert');
var describe = mocha.describe;
var it = mocha.it;

describe.skip('test lib/memcached.js', function () {
  this.timeout(10000);
  var now = Date.now();
  it('set key', function (done) {
    memcached.setAsync('time', now, 10)
      .then(function (result) {
        assert(result);
        done();
      }).catch(done);
  });
  it('get key', function (done) {
    memcached.getAsync('time')
      .then(function (value) {
        assert(now === value);
        done();
      }).catch(done);
  });
  it('delete key', function (done) {
    memcached.delAsync('time')
      .then(function (result) {
        assert(result);
        done();
      }).catch(done);
  });
  it('get empty key', function (done) {
    memcached.getAsync('time')
      .then(function (result) {
        assert(result === undefined);
        done();
      }).catch(done);
  });
});
