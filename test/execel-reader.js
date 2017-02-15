/**
 * @date 2017/2/15
 * @author xialeistudio<1065890063@qq.com>
 */
'use strict';
var excelReader = require('../lib/excel-reader');
var mocha = require('mocha');
var assert = require('assert');
var describe = mocha.describe;
var it = mocha.it;

describe.skip('test lib/excel-reader.js', function () {
  this.timeout(0);
  it('test read', function (done) {
    excelReader(__dirname + '/test.xlsx')
      .on('data', function (row) {
        assert(row.ip !== undefined);
      })
      .on('error', done)
      .on('close', done);
  });
});
