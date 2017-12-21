const util = require('util');
const log4js = require("../services/log4js.service");
const __REQUEST__ = require("../services/request.service");
const __LOGGER__ = log4js.getLogger("default");

const __APP_ID__ = "wx1133464776a7a161";
const __APP_SECRET__ = "c3eceda5d7c37f7fd74b7f5da2638638";
const __REQ_ACCESS_TOKEN__ = "https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=" + __APP_ID__ + "&secret=" + __APP_SECRET__;

const __REQ_CREATE_MENU__ = "https://api.weixin.qq.com/cgi-bin/menu/create?access_token=%s";
const __REQ_DELETE_MENU__ = "https://api.weixin.qq.com/cgi-bin/menu/delete?access_token=%s";

var CredentailService = {
    getRealtimeAccessToken: function () {
        __REQUEST__.doHttpsGet(__REQ_ACCESS_TOKEN__, function (data) {
            const accessToken = JSON.parse(data).access_token;
            const req = util.format(__REQ_DELETE_MENU__, accessToken);

            __REQUEST__.doHttpsPost(req, {}, function (data) {

                const mainpage = encodeURIComponent("http://www.thinmelon.cc");
                const link = util.format(
                    "https://open.weixin.qq.com/connect/oauth2/authorize?appid=%s&redirect_uri=%s&response_type=code&scope=snsapi_userinfo&state=111#wechat_redirect",
                    __APP_ID__, mainpage);
                __LOGGER__.info("MENU - LINK: " + link);

                const params =
                    {
                        "button": [
                            {
                                "name": "公众平台",
                                "sub_button": [
                                    {
                                        "type": "view",
                                        "name": "预约挂号",
                                        "url": link
                                    }
                                ]
                            }
                        ]
                    };

                const url = util.format(__REQ_CREATE_MENU__, accessToken);

                __REQUEST__.doHttpsPost(url, params, function (data) {
                })
            })


        });
    }
};

CredentailService.getRealtimeAccessToken();