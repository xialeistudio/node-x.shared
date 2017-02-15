/**
 * @date 2017/2/15
 * @author xialeistudio<1065890063@qq.com>
 */
'use strict';
var fetch = require('node-fetch');
var Qiniu = require('../lib/qiniu');
var config = require('./qiniu.config');
var qiniu = new Qiniu(config.ak, config.sk, config.bucket, config.bucketURL);
var mocha = require('mocha');
var assert = require('assert');
var describe = mocha.describe;
var it = mocha.it;

describe('test lib/qiniu.js', function () {
  this.timeout(30000);
  var key;
  var time = Date.now().toString();
  it('test put', function (done) {
    qiniu.put(time).then(function (ret) {
      assert(ret.key !== undefined);
      key = ret.key;
      done();
    }).catch(done);
  });
  it('test getPrivacyURL', function (done) {
    var downloadURL = qiniu.getPrivateURL(key, 10);
    fetch(downloadURL)
      .then(function (res) {
        return res.text();
      })
      .then(function (data) {
        assert(data === time);
        done();
      }).catch(done);
  });
  it('test getPrivacyURL expired', function (done) {
    var downloadURL = qiniu.getPrivateURL(key, 2);
    setTimeout(function () {
      fetch(downloadURL)
        .then(function (res) {
          return res.json();
        })
        .then(function (data) {
          assert(data.error === 'token out of date');
          done();
        }).catch(done);
    }, 3000);
  });
});
