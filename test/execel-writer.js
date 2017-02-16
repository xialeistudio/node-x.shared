/**
 * @date 2017/2/15
 * @author xialeistudio<1065890063@qq.com>
 */
'use strict';
var excelWriter = require('../lib/excel-writer');
var mocha = require('mocha');
// var assert = require('assert');
var describe = mocha.describe;
var it = mocha.it;

describe.skip('test lib/excel-writer.js', function () {
  this.timeout(0);
  it('test write', function (done) {
    var writer = excelWriter(__dirname + '/data.xlsx');
    for (var i = 1; i <= 100000; i++) {
      var number = i;
      var name = 'name' + i;
      writer.addRow({number: number, name: name});
    }
    writer.finalize();
    setTimeout(function () {
      done();
    }, 3000);
  });
});
