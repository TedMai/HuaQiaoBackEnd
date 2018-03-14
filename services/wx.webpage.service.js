const Q = require('q');
const util = require('util');
const credential = require('./credential.service');
const log4js = require("../services/log4js.service");
const __LOGGER__ = log4js.getLogger("default");
const __REQUEST__ = require("../services/request.service");

/**
 * 微信公众号网页
 *  --  设置菜单栏
 *  --  删除菜单项
 */
const __REQ_CREATE_MENU__ = "https://api.weixin.qq.com/cgi-bin/menu/create?access_token=%s";
const __REQ_DELETE_MENU__ = "https://api.weixin.qq.com/cgi-bin/menu/delete?access_token=%s";

const redirectUrl = encodeURIComponent("https://www.thinmelon.cc/authorization/oauth2");

const baiduMap = util.format(
    "https://open.weixin.qq.com/connect/oauth2/authorize?appid=%s&redirect_uri=%s&response_type=code&scope=snsapi_userinfo&state=%s#wechat_redirect",
    credential.getAppID(), redirectUrl, 'map');

const reportList = util.format(
    "https://open.weixin.qq.com/connect/oauth2/authorize?appid=%s&redirect_uri=%s&response_type=code&scope=snsapi_userinfo&state=%s#wechat_redirect",
    credential.getAppID(), redirectUrl, 'report');

const newCard = util.format(
    "https://open.weixin.qq.com/connect/oauth2/authorize?appid=%s&redirect_uri=%s&response_type=code&scope=snsapi_userinfo&state=%s#wechat_redirect",
    credential.getAppID(), redirectUrl, 'card');

const params =
    {
        "button": [
            {
                "type": "view",
                "name": "百度地图",
                "url": baiduMap
            },
            {

                "type": "view",
                "name": "报告单",
                "url": reportList
            },
            {

                "type": "view",
                "name": "个人中心",
                "url": newCard
            }
        ]
    };

var wxWebpageService = {
    /**
     *
     * @param accessToken
     * @returns {*|promise|jQuery.promise|Promise}
     */
    addMenu: function (accessToken) {
        const deferred = Q.defer();
        const req = util.format(__REQ_CREATE_MENU__, accessToken);
        __REQUEST__.doHttpsPost(req, params, function (data) {
            const result = JSON.parse(data);
            if (result.hasOwnProperty('errcode') && 0 === result.errcode) {
                deferred.resolve(accessToken);
            } else {
                deferred.reject(result);
            }

        });
        return deferred.promise;
    },
    /**
     *
     * @param accessToken
     * @returns {*|promise|jQuery.promise|Promise}
     */
    deleteMenu: function (accessToken) {
        const deferred = Q.defer();
        const req = util.format(__REQ_DELETE_MENU__, accessToken);
        __REQUEST__.doHttpsPost(req, {}, function (data) {
            const result = JSON.parse(data);
            if (result.hasOwnProperty('errcode') && 0 === result.errcode) {
                deferred.resolve(accessToken);
            } else {
                deferred.reject(result);
            }
        });
        return deferred.promise;
    }
};

module.exports = wxWebpageService;

//credential
//    .getRealtimeAccessToken()
//    .then(wxWebpageService.deleteMenu)
//    .then(wxWebpageService.addMenu)
//    .catch(function (err) {
//        __LOGGER__.error(err);
//    });