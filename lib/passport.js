/**
 * @date 2017/2/16
 * @author xialeistudio<1065890063@qq.com>
 */
'use strict';
var fetch = require('node-fetch');
var crypt = require('crypto');
var _ = require('lodash');
var qs = require('querystring');
var PassportError = require('./error').PassportError;
var debug = require('debug')('x.passport');
/**
 * 构造方法
 * @param {Number} qunAppId 群友APPID
 * @param {String} qunProduct 群友产品
 * @param {String} wxAppId 微信APPID
 * @constructor
 */
function Passport(qunAppId, qunProduct, wxAppId) {
  this._baseURL = 'http://reg.qun.hk';
  this._qunAppId = qunAppId;
  this._qunProduct = qunProduct;
  this._wxAppId = wxAppId;
  debug('passport', {
    qunAppId: qunAppId,
    qunProduct: qunProduct,
    wxAppId: wxAppId
  });
}
/**
 * 签名
 * @param {*} data 待签名数据
 * @return {*}
 */
Passport.prototype.md5 = function (data) {
  var md5 = crypt.createHash('md5');
  md5.update(data);
  return md5.digest('hex');
};
/**
 * 请求Passport
 * @param {String} url 请求URL
 * @param {Object} options 请求参数
 * @return {Promise}
 */
Passport.prototype.request = function (url, options) {
  return fetch(url, options).then(function (res) {
    return res.json();
  });
};
/**
 * 请求参数签名
 * @param {Array} params
 * @return {String} 签名字符串
 */
Passport.prototype.sign = function (params) {
  params = params.sort();
  return this.md5(params.join('-'));
};
/**
 * 获取AccessToken
 * @param {Number} qunAppId 群友APPID
 * @return {Promise}
 */
Passport.prototype.getAccessToken = function (qunAppId) {
  qunAppId = qunAppId || this._qunAppId;
  return this.request(this._baseURL + '/jsapi/accesstoken/app/' + qunAppId).then(function (res) {
    debug('getAccessToken', res);
    return res;
  });
};
/**
 * 读取OPENID
 * @param {String} userId 通行证用户ID
 * @param {String} qunProduct 群友Product
 * @param {String} wxAppId 微信APPID
 * @param {Boolean} returnAll 返回该用户所有授权openid
 * @return {Promise}
 */
Passport.prototype.getOpenid = function (userId, qunProduct, wxAppId, returnAll) {
  qunProduct = qunProduct || this._qunProduct;
  wxAppId = wxAppId || this._wxAppId;
  var body = {
    openid: userId
  };
  var query = {
    product: qunProduct
  };
  query.sign = this.sign(_.valuesIn(body));
  return this.request(this._baseURL + '/user/wechatoauth?' + qs.stringify(query), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: qs.stringify(body)
  }).then(function (res) {
    debug('getOpenid', userId, res);
    if (res.errcode !== 0) {
      throw new PassportError(res.info, res.errcode);
    }
    if (res.info.length === 0) {
      return null;
    }
    if (returnAll) {
      return res.info;
    }
    var user = _.findWhere(res.info, {wechat_appid: wxAppId});
    if (user === undefined) {
      return null;
    }
    return user.openid;
  });
};
/**
 * 读取用户推送设备
 * @param {String} userId 通行证userId
 * @param {String} qunProduct 群友Product
 */
Passport.prototype.getPushDevices = function (userId, qunProduct) {
  qunProduct = qunProduct || this._qunProduct;
  var body = {
    openid: userId
  };
  var query = {
    product: qunProduct
  };
  query.sign = this.sign(_.valuesIn(body));
  return this.request(this._baseURL + '/push/info?' + qs.stringify(query), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: qs.stringify(body)
  }).then(function (res) {
    debug('getPushDevices', userId, res);
    if (res.errcode !== 0) {
      throw new PassportError(res.info, res.errcode);
    }
    return res.info;
  });
};

module.exports = Passport;
