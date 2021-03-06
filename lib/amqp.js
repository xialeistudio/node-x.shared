/**
 * @date 2017/2/15
 * @author xialeistudio<1065890063@qq.com>
 */
'use strict';
var amqplib = require('amqplib');
var debug = require('debug')('x.amqp');
/**
 * 构造方法
 * @param {Object|String} url 连接参数
 * @param {Object} options 连接选项
 * @constructor
 */
function AMQP(url, options) {
  this.connectionConfig = {
    url: url,
    options: options
  };
  debug('connectionConfig', this.connectionConfig);
}

/**
 * 设置队列配置
 * @param {String} name 队列名称
 * @param {Object} options 队列选项
 */
AMQP.prototype.setQueueConfig = function (name, options) {
  this.queueConfig = {
    name: name,
    options: options
  };
  debug('queueConfig', this.queueConfig);
};

/**
 * 订阅消息
 * @param {Function} callback 消息消费函数(error,msg,channel)
 */
AMQP.prototype.subscribe = function (callback) {
  if (!this.connectionConfig) {
    throw new Error('connectionConfig未配置，请通过setConnectionConfig进行配置');
  }
  if (!this.queueConfig) {
    throw new Error('queueConfig未配置，请通过setQueueConfig进行配置');
  }
  if (!callback || typeof callback !== 'function') {
    throw new Error('callback不是合法的函数');
  }
  var self = this;
  amqplib.connect(this.connectionConfig.url, this.connectionConfig.options)
    .then(function (connection) {
      self.connection = connection;
      debug('queue connected');
      return connection.createChannel();
    })
    .then(function (channel) {
      self.channel = channel;
      debug('channel created');
      channel.assertQueue(self.queueConfig.name, self.queueConfig.options);
      channel.consume(self.queueConfig.name, function (msg) {
        callback(null, msg, channel);
      });
    })
    .catch(callback);
};
/**
 * 配置发布
 * @param {String} exchangeName 交换机名称
 * @param {String} routingKey 路由Key
 */
AMQP.prototype.setPublishConfig = function (exchangeName, routingKey) {
  this.publishConfig = {
    exchangeName: exchangeName,
    routingKey: routingKey
  };
  debug('publishConfig', this.publishConfig);
};
/**
 * 发送数据到队列
 * @param {String|Buffer} data
 */
AMQP.prototype.publish = function (data) {
  if (!this.connectionConfig) {
    throw new Error('connectionConfig未配置，请通过setConnectionConfig进行配置');
  }
  if (!this.publishConfig) {
    throw new Error('publishConfig未配置，请通过setPublishConfig进行配置');
  }
  var self = this;
  return amqplib.connect(this.connectionConfig.url, this.connectionConfig.options)
    .then(function (connection) {
      self.connection = connection;
      debug('queue connected');
      return connection.createChannel();
    })
    .then(function (channel) {
      self.channel = channel;
      debug('channel created');
      var buffer = Buffer.isBuffer(data) ? data : new Buffer(data);
      return channel.publish(self.publishConfig.exchangeName, self.publishConfig.routingKey, buffer);
    });
};

module.exports = AMQP;
