/**
 * @date 2017/2/15
 * @author xialeistudio<1065890063@qq.com>
 */
'use strict';
var qiniu = require('qiniu');
var debug = require('debug')('x.qiniu');
var Promise = require('bluebird');

/**
 * 构造方法
 * @param {String} accessKey 七牛accessKey
 * @param {String} secretKey 七牛secretKey
 * @param {String} bucket 七牛空间名称
 * @param bucketURL
 * @constructor
 */
function Qiniu(accessKey, secretKey, bucket, bucketURL) {
  qiniu.conf.ACCESS_KEY = accessKey;
  qiniu.conf.SECRET_KEY = secretKey;
  this._bucket = bucket;
  this._bucketURL = bucketURL;
  debug('initialize', {
    accessKey: accessKey,
    secretKey: secretKey,
    bucket: bucket,
    bucketURL: bucketURL
  });
}

/**
 * 获取上传token
 * @param {Object} options 上传选项
 */
Qiniu.prototype.getToken = function (options) {
  var putPolicy = new qiniu.rs.PutPolicy(this._bucket);
  if (options !== undefined) {
    Object.keys(options).forEach(function (key) {
      putPolicy[key] = options[key];
    });
  }
  return putPolicy.token();
};
/**
 * 上传文件
 * @param {String} localFile 本地文件路径
 * @param {String|*} token 上传Token
 * @param {String|*} key 文件保存key
 * @param {Object|*} options 上传选项
 */
Qiniu.prototype.putFile = function (localFile, token, key, options) {
  var extra = new qiniu.io.PutExtra();
  if (!token) {
    token = this.getToken();
  }
  if (options !== undefined) {
    Object.keys(options).forEach(function (key) {
      extra[key] = options[key];
    });
  }
  return new Promise(function (resolve, reject) {
    qiniu.io.putFile(token, key, localFile, extra, function (e, ret) {
      e === null ? resolve(ret) : reject(e);
    });
  });
};
/**
 * 上传数据
 * @param {*} data 上传数据
 * @param {String|*} token 上传Token
 * @param {String|*} key 文件保存key
 * @param {Object|*} options 上传选项
 */
Qiniu.prototype.put = function (data, token, key, options) {
  var extra = new qiniu.io.PutExtra();
  if (!token) {
    token = this.getToken();
  }
  if (options !== undefined) {
    Object.keys(options).forEach(function (key) {
      extra[key] = options[key];
    });
  }
  return new Promise(function (resolve, reject) {
    qiniu.io.put(token, key, data, extra, function (e, ret) {
      e === null ? resolve(ret) : reject(e);
    });
  });
};

/**
 * 获取公开的完整URL
 * @param {String} key Object名称
 * @return {string}
 */
Qiniu.prototype.getPublicURL = function (key) {
  return this._bucketURL + '/' + key;
};

/**
 * 获取私有下载连接
 * @param {String} url URL
 * @param {Number} expiresIn URL有效时间，单位秒
 */
Qiniu.prototype.getPrivateURL = function (url, expiresIn) {
  var policy = new qiniu.rs.GetPolicy(expiresIn);
  return policy.makeRequest(url);
};
module.exports = Qiniu;
