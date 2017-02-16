/**
 * @date 2017/2/15
 * @author xialeistudio<1065890063@qq.com>
 */
'use strict';
var mocha = require('mocha');
var assert = require('assert');
var describe = mocha.describe;
var it = mocha.it;

describe('test lib/error.js', function () {
  it.skip('test passport-error', function () {
    var PassportError = require('../lib/error').PassportError;
    var e = new PassportError('token过期', 1);
    assert(e instanceof Error);
    assert(e.message === 'token过期');
    assert(e.code === 1);
  });
});
