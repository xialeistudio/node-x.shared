/**
 * @date 2017/2/15
 * @author xialeistudio<1065890063@qq.com>
 */
'use strict';
module.exports = {
  amqp: require('./lib/amqp'),
  memcached: require('./lib/memcached'),
  qiniu: require('./lib/qiniu'),
  excelReader: require('./lib/excel-reader'),
  excelWriter: require('./lib/excel-writer')
};
