const http = require('http');
const log4js = require("../services/log4js.service");
const __REQUEST__ = require("../services/request.service");
const __LOGGER__ = log4js.getLogger("default");

const __APP_ID__ = "wx1133464776a7a161";
const __APP_SECRET__ = "c3eceda5d7c37f7fd74b7f5da2638638";
const __REQ_ACCESS_TOKEN__ = "https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=" + __APP_ID__ + "&secret=" + __APP_SECRET__;



var CredentailService = {
    getRealtimeAccessToken: function () {
        __REQUEST__.doHttpsGet(__REQ_ACCESS_TOKEN__, function (data) {
            // __LOGGER__.info(JSON.parse(data));
        });
    }
};

CredentailService.getRealtimeAccessToken();