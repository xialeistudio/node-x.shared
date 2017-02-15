/**
 * @date 2017/2/15
 * @author xialeistudio<1065890063@qq.com>
 */
'use strict';
var excel = require('excel-stream');
var fs = require('fs');
/**
 * 使用stream读取excel
 * @param {String} path 需要读取的excel路径
 * @param {Object} options 读取选项
 */
module.exports = function (path, options) {
  return fs.createReadStream(path).pipe(excel(options));
};
