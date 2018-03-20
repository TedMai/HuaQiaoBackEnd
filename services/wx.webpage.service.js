const Q = require('q');
const util = require('util');
const credential = require('./credential.service');
const __REQUEST__ = require("../services/request.service");

/**
 * 重定向URL
 * @type {string}
 */
const redirectUrl = encodeURIComponent("https://www.thinmelon.cc/authorization/oauth2");
/**
 * 百度导航链接地址
 * @type {string}
 */
const redirectToMap = encodeURIComponent("http://www.thinmelon.cc/tools/map");
const baiduMap = util.format(
    "https://open.weixin.qq.com/connect/oauth2/authorize?appid=%s&redirect_uri=%s&response_type=code&scope=snsapi_userinfo&state=%s#wechat_redirect",
    credential.getAppID(), redirectToMap, 'map');
/**
 * 报告单链接地址
 * - state report
 */
const reportList = util.format(
    "https://open.weixin.qq.com/connect/oauth2/authorize?appid=%s&redirect_uri=%s&response_type=code&scope=snsapi_userinfo&state=%s#wechat_redirect",
    credential.getAppID(), redirectUrl, 'report');
/**
 * 个人中心链接地址
 * - state user
 */
const myProfile = util.format(
    "https://open.weixin.qq.com/connect/oauth2/authorize?appid=%s&redirect_uri=%s&response_type=code&scope=snsapi_userinfo&state=%s#wechat_redirect",
    credential.getAppID(), redirectUrl, 'user');

const params =
    {
        "button": [
            {
                "type": "view",
                "name": "医院导航",
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
                "url": myProfile
            }
        ]
    };
/**
 * 微信公众号网页
 *  --  设置菜单栏
 *  --  删除菜单项
 */
const __REQ_CREATE_MENU__ = "https://api.weixin.qq.com/cgi-bin/menu/create?access_token=%s";
const __REQ_DELETE_MENU__ = "https://api.weixin.qq.com/cgi-bin/menu/delete?access_token=%s";
var wxWebpageService = {

    /**
     * 设置菜单栏
     * @param request
     * @returns {*|promise|jQuery.promise|Promise}
     */
    addMenu: function (request) {
        const deferred = Q.defer();
        const req = util.format(__REQ_CREATE_MENU__, request.accessToken);
        __REQUEST__.doHttpsPost(req, params, function (data) {
            const result = JSON.parse(data);
            if (result.hasOwnProperty('errcode') && 0 === result.errcode) {
                deferred.resolve(request);
            } else {
                deferred.reject(result);
            }

        });
        return deferred.promise;
    },

    /**
     * 删除菜单项
     * @param request
     * @returns {*|promise|jQuery.promise|Promise}
     */
    deleteMenu: function (request) {
        const deferred = Q.defer();
        const req = util.format(__REQ_DELETE_MENU__, request.accessToken);
        __REQUEST__.doHttpsPost(req, {}, function (data) {
            const result = JSON.parse(data);
            if (result.hasOwnProperty('errcode') && 0 === result.errcode) {
                deferred.resolve(request);
            } else {
                deferred.reject(result);
            }
        });
        return deferred.promise;
    }
};

module.exports = wxWebpageService;

// credential
//     .getRealtimeAccessToken({})
//     .then(wxWebpageService.deleteMenu)
//     .then(wxWebpageService.addMenu)
//     .catch(function (err) {
//         console.error(err);
//     });