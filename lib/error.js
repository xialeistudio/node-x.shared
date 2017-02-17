/**
 * @date 2017/2/16
 * @author xialeistudio<1065890063@qq.com>
 */
'use strict';
/**
 * 通行证错误
 * @param {String} message 错误消息
 * @param {Number|String} code 错误代码
 * @constructor
 */
function PassportError(message, code) {
  Error.call(this);
  this.message = message;
  this.code = code;
  this.name = 'SharedError';
}
PassportError.prototype = new Error();
exports.PassportError = PassportError;
