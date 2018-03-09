const util = require('util');
const log4js = require("../services/log4js.service");
const __REQUEST__ = require("../services/request.service");
const __LOGGER__ = log4js.getLogger("default");
/**
 * 微信公众号网页
 *  --  测试账号
 *      --  AppID
 *      --  AppSecret
 *  --  accessToken请求链接
 */
// const __APP_ID__ = "wx1133464776a7a161";
// const __APP_SECRET__ = "c3eceda5d7c37f7fd74b7f5da2638638";
// const __REQ_ACCESS_TOKEN__ = "https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=" + __APP_ID__ + "&secret=" + __APP_SECRET__;
/**
 * 微信公众号网页
 *  --  莆田华侨医院
 *      --  AppID
 *      --  AppSecret
 *  --  accessToken请求链接
 */
const __APP_ID__ = "wx853357062285c49a";
const __APP_SECRET__ = "97fd5625d083e2fcd4adef455962eddb";
const __REQ_ACCESS_TOKEN__ = "https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=" + __APP_ID__ + "&secret=" + __APP_SECRET__;
/**
 * 微信公众号网页
 *  --  设置菜单栏
 *  --  删除菜单项
 */
const __REQ_CREATE_MENU__ = "https://api.weixin.qq.com/cgi-bin/menu/create?access_token=%s";
const __REQ_DELETE_MENU__ = "https://api.weixin.qq.com/cgi-bin/menu/delete?access_token=%s";
/**
 * 微信小程序
 *  --  深瓜
 *      --  AppID
 *      --  AppSecret
 *  -- openId 请求链接
 */
const __APP_ID_MINI_PROGRAM__ = "wx0a72bd7d41e0b066";
const __APP_SECRET_MINI_PROGRAM__ = "32e38063345fe06194fd59c970fde966";
const __REQ_OPENID__ = "https://api.weixin.qq.com/sns/jscode2session?appid=%s&secret=%s&js_code=%s&grant_type=authorization_code";

var CredentailService = {
    /**
     * 微信公众号网页
     */
    getRealtimeAccessToken: function () {
        __REQUEST__.doHttpsGet(__REQ_ACCESS_TOKEN__, function (data) {
            const accessToken = JSON.parse(data).access_token;
            const req = util.format(__REQ_DELETE_MENU__, accessToken);
            __LOGGER__.info("AccessToken: " + accessToken);
            __REQUEST__.doHttpsPost(req, {}, function (data) {
                const mainpage = encodeURIComponent("http://www.thinmelon.cc");
                const myProfile = encodeURIComponent("http://www.thinmelon.cc/my");
                const myAppointment = encodeURIComponent("http://www.thinmelon.cc/my/appointment");

                const link = util.format(
                    "https://open.weixin.qq.com/connect/oauth2/authorize?appid=%s&redirect_uri=%s&response_type=code&scope=snsapi_userinfo&state=111#wechat_redirect",
                    __APP_ID__, mainpage);
                __LOGGER__.info("MENU - LINK: " + link);
                const myProfileLink = util.format(
                    "https://open.weixin.qq.com/connect/oauth2/authorize?appid=%s&redirect_uri=%s&response_type=code&scope=snsapi_userinfo&state=111#wechat_redirect",
                    __APP_ID__, myProfile);
                const myAppointmentLink = util.format(
                    "https://open.weixin.qq.com/connect/oauth2/authorize?appid=%s&redirect_uri=%s&response_type=code&scope=snsapi_userinfo&state=111#wechat_redirect",
                    __APP_ID__, myAppointment);

                const params =
                    {
                        "button": [
                            {
                                "name": "健康服务",
                                "sub_button": [
                                    {
                                        "type": "view",
                                        "name": "个人中心",
                                        "url": myProfileLink
                                    },
                                    {
                                        "type": "view",
                                        "name": "满意度调查",
                                        "url": link
                                    },
                                    {
                                        "type": "view",
                                        "name": "预约记录",
                                        "url": myAppointmentLink
                                    },
                                    {
                                        "type": "view",
                                        "name": "医院导航",
                                        "url": link
                                    },
                                    {
                                        "type": "view",
                                        "name": "就诊指南",
                                        "url": link
                                    }
                                ]
                            },
                            {
                                "name": "住院服务",
                                "sub_button": [
                                    {
                                        "type": "view",
                                        "name": "APP下载",
                                        "url": link
                                    },
                                    {
                                        "type": "view",
                                        "name": "报告单",
                                        "url": myAppointmentLink
                                    },
                                    {
                                        "type": "view",
                                        "name": "住院费用",
                                        "url": link
                                    },
                                    {
                                        "type": "view",
                                        "name": "住院记录",
                                        "url": link
                                    },
                                    {
                                        "type": "view",
                                        "name": "住院充值",
                                        "url": link
                                    }
                                ]
                            },
                            {
                                "name": "门诊服务",
                                "sub_button": [
                                    {
                                        "type": "view",
                                        "name": "预约挂号",
                                        "url": link
                                    },
                                    {
                                        "type": "view",
                                        "name": "分诊叫号",
                                        "url": link
                                    },
                                    {
                                        "type": "view",
                                        "name": "门诊费用",
                                        "url": link
                                    },
                                    {
                                        "type": "view",
                                        "name": "门诊记录",
                                        "url": link
                                    },
                                    {
                                        "type": "view",
                                        "name": "门诊充值",
                                        "url": link
                                    }
                                ]
                            }
                        ]
                    };

                const url = util.format(__REQ_CREATE_MENU__, accessToken);

                __REQUEST__.doHttpsPost(url, params, function (data) {
                    __LOGGER__.info("RESULT: " + data);
                })
            })
        });
    },
    /**
     * 微信小程序
     */
    fetchUserOpenId: function (code, response) {
        __REQUEST__.doHttpsGet(util.format(__REQ_OPENID__, __APP_ID_MINI_PROGRAM__, __APP_SECRET_MINI_PROGRAM__, code), function (data) {
            response(JSON.parse(data));
        });
    }

};

module.exports = CredentailService;

// CredentailService.getRealtimeAccessToken();