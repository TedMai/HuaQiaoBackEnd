const __EXPRESS__ = require('express');
const __ROUTER__ = __EXPRESS__.Router();
const __LOG4JS__ = require("../services/log4js.service");
const __LOGGER__ = __LOG4JS__.getLogger("default");
const __UTIL__ = require('util');
const __RENDER__ = require('./response');
const __HELPER__ = require('../routes/judge.helper');
/**
 * 服务
 */
const __CREDENTIAL__ = require("../services/credential.service");
const __HEALTH_BUREAU__ = require('../services/health.bureau.service');
const __SMS_SERVICE__ = require('../services/aliyun.sms.service');
/**
 * 数据库
 */
const __BACKBONE__ = require('../db/shadow.api');
const __USER__ = require('../db/user.api');
const __PATIENT_ID_CARD__ = require('../db/patient.idcard.api');
const __REPORT__ = require('../db/report.api');
const __SMS__ = require('../db/sms.api');
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
 *  微信网页授权
 *  用户同意授权后，页面将跳转至 redirect_uri/?code=CODE&state=STATE。
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
                            //res.redirect('http://www.thinmelon.cc/card/new');
                            res.redirect(
                                __UTIL__.format('http://www.thinmelon.cc/report/list;s=%s;n=%s;g=%s',
                                    result.nonceStr,
                                    result.nickname,
                                    result.sex));
                        } else {
                            /**
                             * redirect 至报告单页面
                             */
                            __LOGGER__.info("==> redirect 至报告单页面");

                            res.redirect(
                                __UTIL__.format('http://www.thinmelon.cc/report/list;s=%s;n=%s;g=%s',
                                    result.nonceStr,
                                    result.nickname,
                                    result.sex));
                        }
                        __LOGGER__.info("========================== END ==========================");
                    });
                    break;
                case 'user':
                    /**
                     * redirect 至个人中心页面
                     */
                    __LOGGER__.info("==> redirect 至个人中心页面");

                    res.redirect(
                        __UTIL__.format('http://www.thinmelon.cc/user/detail;s=%s',
                            result.nonceStr));
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

/**
 *  签名 - 微信JS-SDK接口调用
 */
__ROUTER__.get('/sign', function (req, res, next) {
    __LOGGER__.info("========================== 签名 ==========================");
    __LOGGER__.info(req.params);
    __LOGGER__.info(req.body);
    __LOGGER__.info(req.query);
    __CREDENTIAL__
        .getRealtimeAccessToken({url: req.query.source})
        .then(__CREDENTIAL__.getRealJsapiTicket)
        .then(__CREDENTIAL__.getSignature)
        .then(function (result) {
            __LOGGER__.debug(result);
            res.json(result);
            __LOGGER__.info("========================== END ==========================");
        })
        .catch(function (err) {
            __LOGGER__.error(err);
            res.json(err);
            __LOGGER__.info("========================== END ==========================");
        });
});

/**
 * 查询列表
 */
__ROUTER__.get('/table/:name', function (req, res, next) {
    __LOGGER__.info("========================== 查询就诊卡列表 ==========================");
    //req = {params: {name: 'user'}, query: {session: '9287592'}};
    __LOGGER__.info(req.params);
    __LOGGER__.info(req.body);
    __LOGGER__.info(req.query);
    __HELPER__.fetch(req, function (request) {
        __RENDER__.renderPage(request, res, next);
        __LOGGER__.info("========================== END ==========================");
    });
});

/**
 * 查询报告单
 *  -   查询条件 日期范围及SessionKey
 */
__ROUTER__.get('/table/:name/:from-:to', function (req, res, next) {
    __LOGGER__.info("========================== 查询报告单 ==========================");
    __LOGGER__.info(req.params);
    __LOGGER__.info(req.body);
    __LOGGER__.info(req.query);
    __REPORT__.queryRelativeReport(req, function (result) {
        __RENDER__.renderPage(result, res, next);
        __LOGGER__.info("========================== END ==========================");
    });
});

/**
 * 查询报告单详情
 */
__ROUTER__.get('/table/:name/id/:id', function (req, res, next) {
    __LOGGER__.info("========================== 查询报告单详情 ==========================");
    __LOGGER__.info(req.params);
    __LOGGER__.info(req.body);
    __LOGGER__.info(req.query);
    __REPORT__.queryRelativeInspection(req, function (result) {
        __RENDER__.renderPage(result, res, next);
        __LOGGER__.info("========================== END ==========================");
    });
});

/**
 * 验证就诊卡有效性
 */
__ROUTER__.post('/check', function (req, res, next) {
    __LOGGER__.info("========================== 验证就诊卡有效性 ==========================");
    __LOGGER__.info(req.params);
    __LOGGER__.info(req.body);
    __LOGGER__.info(req.query);
    /**
     * 获取就诊卡 - 姓名 + 手机号码
     */
    __HEALTH_BUREAU__
        .getSpecificPatientIdCard(req)
        .then(
            function (card) {
                /**
                 * 绑定就诊卡
                 */
                __PATIENT_ID_CARD__.isBound(card, function (result) {
                    res.json(result);
                    __LOGGER__.info("========================== END ==========================");
                })
            }
        )
        .catch(function (error) {
            res.json(error);
        });
});

/**
 * 绑定就诊卡
 */
__ROUTER__.post('/bind', function (req, res, next) {
    __LOGGER__.info("========================== Bind Patient Id Card ==========================");
    //req = {
    //    body: {
    //        requestId: 'BE65BDA0-2ECF-490A-A893-9BBA66DD6AE0',
    //        bizId: '279723421270865252^0',
    //        phone: '18159393355',
    //        verificationCode: '671722',
    //        name: 'kyle',
    //        session: 'VcT2yIm0rCPsGsmmgVX01IGKZ3gxvZhH',
    //        cardid: 'B26935701'
    //    }
    //};
    __LOGGER__.info(req.params);
    __LOGGER__.info(req.body);
    __LOGGER__.info(req.query);
    __SMS__.checkSms(req, function (response) {
        if (response.code === 0) {
            __PATIENT_ID_CARD__.bindPatientIDCard(req, function (result) {
                res.json(result);
                __LOGGER__.info("========================== END ==========================");
            });
        } else {
            res.json({
                code: -300,
                msg: "验证码输入有误！"
            });
        }
    });
});

/**
 * 绑定前的安全检查
 */
__ROUTER__.post('/safety', function (req, res, next) {
    __LOGGER__.info("========================== Safety Inspection Before Unbind ==========================");
    __LOGGER__.info(req.params);
    __LOGGER__.info(req.body);
    __LOGGER__.info(req.query);
    __PATIENT_ID_CARD__.getPhoneInCard(req, function (response) {
        console.log(response);
        if (response.code === 0 && response.msg.length > 0) {
            __SMS_SERVICE__.send({params: {type: '0', phone: response.msg[0].phone}}, function (request) {
                if (request.result.Code === "OK") {
                    __SMS__.addSms(request, function () {
                        res.json(request.result);
                        __LOGGER__.info("========================== end ==========================");
                    });
                } else {
                    // next(new Error(request.Message));
                    res.json(request.result.Message);
                    __LOGGER__.info("========================== end ==========================");
                }
            });
        } else {
            res.json({
                code: -100,
                msg: "未找到相关记录！"
            });
        }
    })

});

/**
 * 解绑
 */
__ROUTER__.post('/unbind', function (req, res, next) {
    __LOGGER__.info("========================== Unbind Patient ID Card ==========================");
    //req = {
    //    body: {
    //        requestId: 'BE65BDA0-2ECF-490A-A893-9BBA66DD6AE0',
    //        bizId: '279723421270865252^0',
    //        phone: '18159393355',
    //        verificationCode: '671722',
    //        cardid: 'B26935700'
    //    }
    //};
    __LOGGER__.info(req.params);
    __LOGGER__.info(req.body);
    __LOGGER__.info(req.query);
    __SMS__.checkSms(req, function (response) {
        if (response.code === 0) {
            __PATIENT_ID_CARD__.removePatientIdCard(req, function (result) {
                res.json(result);
                __LOGGER__.info("========================== END ==========================");
            });
        } else {
            res.json({
                code: -300,
                msg: "验证码输入有误！"
            });
        }
    });
});

module.exports = __ROUTER__;
