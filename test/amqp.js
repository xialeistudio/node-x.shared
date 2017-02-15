/**
 * @date 2017/2/15
 * @author xialeistudio<1065890063@qq.com>
 */
'use strict';
var AMQP = require('../lib/amqp');
var config = require('./amqp.config');
var mocha = require('mocha');
var assert = require('assert');
var describe = mocha.describe;
var it = mocha.it;

describe.skip('test lib/amqp.js', function () {
  this.timeout(10000);
  var now = Date.now();
  it('test publish', function (done) {
    var amqp = new AMQP(config.connection);
    amqp.setPublishConfig(config.exchangeName, config.routingKey);
    amqp.publish(now.toString()).then(function (result) {
      assert(result);
      done();
    }).catch(done);
  });
  it('test consumer', function (done) {
    var amqp = new AMQP(config.connection);
    amqp.setQueueConfig(config.queueName, config.queueOptions);
    amqp.subscribe(function (e, msg, channel) {
      if (e !== null) {
        done(e);
        return;
      }
      channel.ack(msg);
      assert(msg.content.toString() === now.toString());
      done();
    });
  });
});
