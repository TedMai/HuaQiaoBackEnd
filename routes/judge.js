const __EXPRESS__ = require('express');
const __ROUTER__ = __EXPRESS__.Router();
const __LOG4JS__ = require("../services/log4js.service");
const __LOGGER__ = __LOG4JS__.getLogger("default");
const __BACKBONE__ = require('../db/shadow.api');
const __CREDENTIAL__ = require("../services/credential.service");
const __UTIL__ = require('util');

/**
 *   设置微信公众号的服务器配置
 *
 */
__ROUTER__.get('/', function (req, res, next) {
    __LOGGER__.info("========================== wechatServerConfig ==========================");
    __LOGGER__.info(req.params);
    __LOGGER__.info(req.body);
    __LOGGER__.info(req.query);
    __BACKBONE__.wechatServerConfig(req, function (request) {
        res.send(request);
        __LOGGER__.info("========================== end ==========================");
    });
});

/**
 *
 * 用户同意授权后，页面将跳转至 redirect_uri/?code=CODE&state=STATE。
 */
__ROUTER__.get('/oauth2', function (req, res, next) {
    __LOGGER__.info("========================== 用户同意授权获取code ==========================");
    __LOGGER__.info(req.params);
    __LOGGER__.info(req.body);
    __LOGGER__.info(req.query);
    __CREDENTIAL__
        .requestForAccessToken({
            code: req.query.code
        })
        .then(__CREDENTIAL__.requestForUserInfo)
        .then(function (result) {
            console.log(decodeURIComponent(req.query.state));
            res.send({
                code: 0,
                userinfo: result
            });
            __LOGGER__.info("========================== END ==========================");
        })
        .catch(function (err) {
            console.log(decodeURIComponent(req.query.state));
            __LOGGER__.error(err);
            //res.send({
            //    code: -100,
            //    msg: err
            //});
            res.redirect(__UTIL__.format('http://www.thinmelon.cc/%s', req.query.state));
            __LOGGER__.info("========================== END ==========================");
        });

});

module.exports = __ROUTER__;