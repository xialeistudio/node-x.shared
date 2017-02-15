/**
 * @date 2017/2/15
 * @author xialeistudio<1065890063@qq.com>
 */
'use strict';
var Memcached = require('memcached');
var Promise = require('bluebird');
Promise.promisifyAll(Memcached);
Promise.promisifyAll(Memcached.prototype);
module.exports = Memcached;
