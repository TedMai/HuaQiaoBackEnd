const __EXPRESS__ = require('express');
const __ROUTER__ = __EXPRESS__.Router();
const __LOG4JS__ = require("../services/log4js.service");
const __LOGGER__ = __LOG4JS__.getLogger("default");
const __BACKBONE__ = require('../db/shadow.api');

/**
 *   初始化 - 后台首页
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

module.exports = __ROUTER__;