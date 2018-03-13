const __EXPRESS__ = require('express');
const __ROUTER__ = __EXPRESS__.Router();
const __LOG4JS__ = require("../services/log4js.service");
const __LOGGER__ = __LOG4JS__.getLogger("default");
const __BACKBONE__ = require('../db/shadow.api');
const __CREDENTIAL__ = require("../services/credential.service");
const __USER__ = require('../db/user.api');
const __PATIENT_ID_CARD__ = require('../db/patient.idcard.api');
// const __UTIL__ = require('util');

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
        /**
         *  微信登录
         *  服务器认证过程
         * */
        .then(__CREDENTIAL__.requestForUserInfo)
        /**
         *  保存登录信息
         */
        .then(__USER__.weChatWebpageLogin)
        /**
         *  由 req.query.state 决定余下操作
         */
        .then(function (result) {
            __LOGGER__.info("==> STATE: " + req.query.state);
            switch (req.query.state) {
                case 'report':
                    /**
                     *  查询就诊卡信息
                     */
                    __PATIENT_ID_CARD__.isPatientIDCardExist(result, function (response) {
                        if (response.code === -400) {
                            /**
                             * 未找到就诊卡记录
                             * redirect 至添加就诊卡页面
                             */
                            __LOGGER__.info("==> redirect 至添加就诊卡页面");
                            res.redirect('http://www.thinmelon.cc/card/new');
                        } else {
                            /**
                             * redirect 至报告单页面
                             */
                            __LOGGER__.info("==> redirect 至报告单页面");
                            res.redirect('http://www.thinmelon.cc/report/list');
                        }
                        __LOGGER__.info("========================== END ==========================");
                    });
                    break;
                default:
                    /**
                     *  缺省 - 登录成功
                     */
                    res.send('login success');
                    __LOGGER__.info("========================== END ==========================");
                    break;
            }
        })
        .catch(function (err) {
            __LOGGER__.info("========================== NEXT ==========================");
            next(err);
        });
}, function (err, req, res, next) {
    __LOGGER__.error(err);
    /**
     * redirect 至错误页面
     */
    __LOGGER__.error("==> redirect 至错误页面");
    // res.redirect(__UTIL__.format('http://www.thinmelon.cc/%s', req.query.state));
    __LOGGER__.info("========================== END ==========================");
});

module.exports = __ROUTER__;
