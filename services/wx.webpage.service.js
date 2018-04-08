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
 * 腾讯地图链接地址
 * @type {string}
 */
const redirectToTencentMap = encodeURIComponent("http://www.thinmelon.cc/tools/tencent");
const tencentMap = util.format(
    "https://open.weixin.qq.com/connect/oauth2/authorize?appid=%s&redirect_uri=%s&response_type=code&scope=snsapi_userinfo&state=%s#wechat_redirect",
    credential.getAppID(), redirectToTencentMap, 'map');
/**
 * 高德地图链接地址
 * @type {string}
 */
const redirectToAlibabaMap = encodeURIComponent("http://www.thinmelon.cc/tools/ali");
const alibabaMap = util.format(
    "https://open.weixin.qq.com/connect/oauth2/authorize?appid=%s&redirect_uri=%s&response_type=code&scope=snsapi_userinfo&state=%s#wechat_redirect",
    credential.getAppID(), redirectToAlibabaMap, 'map');

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

//const params =
//    {
//        "button": [
//            {
//                "type": "view",
//                "name": "医院导航",
//                "url": baiduMap
//            },
//            {
//
//                "type": "view",
//                "name": "报告单",
//                "url": reportList
//            },
//            {
//
//                "type": "view",
//                "name": "个人中心",
//                "url": myProfile
//            }
//        ]
//    };
const params =
    {
        "button": [
            {
                "name": "个人中心",
                "sub_button": [
                    {

                        "type": "view",
                        "name": "报告单",
                        "url": reportList
                    },
                    {

                        "type": "view",
                        "name": "我的就诊卡",
                        "url": myProfile
                    }
                ]
            },
            {
                "name": "关于我们",
                "sub_button": [
                    {
                        "type": "view_limited",
                        "name": "医院简介",
                        "media_id": "mbbZc8pJImZyiP69DaZ9WN_D2Yneh83LMnRvPqtd258"
                    },
                    {
                        "type": "view",
                        "name": "科室简介",
                        "url": "http://mp.weixin.qq.com/mp/homepage?__biz=MzAwMTAyMDY4MA==&hid=1&sn=267810d4c94f42f8fa50910497f3be7c#wechat_redirect"
                        // "media_id": "mbbZc8pJImZyiP69DaZ9WOWw8kR6jTruH3xpPh1H5_4"
                    },
                    {
                        "type": "view_limited",
                        "name": "公告通知",
                        "media_id": "mbbZc8pJImZyiP69DaZ9WOxldQ5jwOAfRSRJ7S9Y3YA"
                    }
                ]
            },
            {
                "type": "view",
                "name": "医院导航",
                "url": baiduMap
                // "name": "医院导航",
                // "sub_button": [
                //     {
                //         "type": "view",
                //         "name": "百度地图",
                //         "url": baiduMap
                //     },
                //     {
                //         "type": "view",
                //         "name": "腾讯地图",
                //         "url": tencentMap
                //     },
                //     {
                //         "type": "view",
                //         "name": "高德地图",
                //         "url": alibabaMap
                //     }
                // ]
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
const __REQ_GET_NEWS_LIST__ = "https://api.weixin.qq.com/cgi-bin/material/batchget_material?access_token=%s";
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
    },
    /**
     * 1、获取永久素材的列表，也包含公众号在公众平台官网素材管理模块中新建的图文消息、语音、视频等素材
     * 2、临时素材无法通过本接口获取
     * 3、调用该接口需https协议
     *    type: 素材的类型，图片（image）、视频（video）、语音 （voice）、图文（news）
     *    offset: 从全部素材的该偏移位置开始返回，0表示从第一个素材 返回
     *    count: 返回素材的数量，取值在1到20之间
     * @param request
     * @returns {promise|jQuery.promise|*|Promise}
     */
    getNewsList: function (request) {
        const deferred = Q.defer();
        const req = util.format(__REQ_GET_NEWS_LIST__, request.accessToken);
        __REQUEST__.doHttpsPost(req, {
                "type": "news",
                "offset": 1,
                "count": 1
            },
            function (data) {
                const result = JSON.parse(data);
                if (result.hasOwnProperty('errcode')) {
                    deferred.reject(result.errmsg);
                } else {
                    deferred.resolve(result);
                }
            });
        return deferred.promise;
    }
};

module.exports = wxWebpageService;

credential
    .getRealtimeAccessToken({})
    .then(wxWebpageService.deleteMenu)
    .then(wxWebpageService.addMenu)
    .catch(function (err) {
        console.error(err);
    });

// credential
//     .getRealtimeAccessToken({})
//     .then(wxWebpageService.getNewsList)
//     .catch(function (err) {
//         console.error(err);
//     });
