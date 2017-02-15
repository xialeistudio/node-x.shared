/**
 * @date 2017/2/15
 * @author xialeistudio<1065890063@qq.com>
 */
'use strict';
var Writer = require('xlsx-writestream');
var fs = require('fs');
/**
 * 写出excel
 * @param {String} path excel文件路径
 * @param {Object} options 选项
 * @return {Writer} 句柄
 */
module.exports = function (path, options) {
  var writer = new Writer(path, options);
  writer.getReadStream().pipe(fs.createWriteStream(path));
  return writer;
};
