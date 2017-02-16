/**
 * @date 2017/2/15
 * @author xialeistudio<1065890063@qq.com>
 */
'use strict';
var mocha = require('mocha');
var assert = require('assert');
var describe = mocha.describe;
var it = mocha.it;

describe.skip('test lib/passport.js', function () {
  this.timeout(10000);
  var Passport = require('../lib/passport');
  var passport = new Passport(5, 'qun', 'wx4334a9bd69b82bd7');
  it('getAccessToken', function (done) {
    passport.getAccessToken().then(function (res) {
      assert(res.access_token !== undefined);
      done();
    }).catch(done);
  });
  it('getOpenid', function (done) {
    passport.getOpenid('oYTgBuJQH96pV2Bb9mzei5y4G9EM').then(function (openid) {
      assert(openid === 'oHAf2ty7K_mvrpFI3ugvr9Y-ipvA');
      done();
    }).catch(done);
  });
  it('getPushDevices', function (done) {
    passport.getPushDevices('oYTgBuJQH96pV2Bb9mzei5y4G9EM').then(function (devices) {
      assert(devices.length > 0);
      done();
    }).catch(done);
  });
});
