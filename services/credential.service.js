const Q = require('q');
const util = require('util');
const log4js = require("../services/log4js.service");
const __REQUEST__ = require("../services/request.service");
const __LOGGER__ = log4js.getLogger("default");
const sha1 = require('sha1');
/**
 * 微信公众号网页
 *  --  测试账号
 *      --  AppID
 *      --  AppSecret
 *  --  accessToken请求链接
 */
//const __APP_ID__ = "wx1133464776a7a161";
//const __APP_SECRET__ = "c3eceda5d7c37f7fd74b7f5da2638638";
/**
 * 微信公众号网页
 *  --  莆田华侨医院
 *      --  AppID
 *      --  AppSecret
 *  --  accessToken请求链接
 */
const __APP_ID__ = "wx853357062285c49a";
const __APP_SECRET__ = "97fd5625d083e2fcd4adef455962eddb";
/**
 * 用户同意授权, 获取code
 * code说明 ： code作为换取access_token的票据，每次用户授权带上的code将不一样，code只能使用一次，5分钟未被使用自动过期。
 * @type {string}
 * @private
 */
const __REQ_CODE__ = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=%s&redirect_uri=%s&response_type=%s&scope=%s&state=%s#wechat_redirect";
/**
 * 网页授权access_token
 * 网页授权的作用域为snsapi_base，则本步骤中获取到网页授权access_token的同时，也获取到了openid，snsapi_base式的网页授权流程即到此为止
 * 网页授权作用域为snsapi_userinfo，则此时开发者可以通过access_token和openid拉取用户信息了
 * @type {string}
 * @private
 */
const __REQ_WEBPAGE_ACCESS_TOKEN__ = "https://api.weixin.qq.com/sns/oauth2/access_token?appid=%s&secret=%s&code=%s&grant_type=%s";
/**
 * 通过access_token和openid拉取用户信息
 * @type {string}
 * @private
 */
const __REQ_USER_INFO__ = "https://api.weixin.qq.com/sns/userinfo?access_token=%s&openid=%s&lang=zh_CN";
/**
 * 基础支持中的access_token
 * access_token（有效期7200秒，开发者必须在自己的服务全局缓存access_token）
 * 该access_token用于调用其他接口
 * @type {string}
 * @private
 */
const __REQ_API_ACCESS_TOKEN__ = "https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=" + __APP_ID__ + "&secret=" + __APP_SECRET__;
/**
 * jsapi_ticket（有效期7200秒，开发者必须在自己的服务全局缓存jsapi_ticket)）
 * @type {string}
 * @private
 */
const __REQ_API_JSAPI_TICKET__ = "https://api.weixin.qq.com/cgi-bin/ticket/getticket?access_token=%s&type=%s";
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

var CredentialService = {
    /**
     * 微信网页JS-SDK
     */
    /**
     * 返回AppID
     * @returns {string}
     */
    getAppID: function () {
        return __APP_ID__;
    },

    /**
     * 用户同意授权，获取code
     * @returns {*|jQuery.promise|promise|Promise}
     */
    requestForCode: function (path) {
        var deferred = Q.defer();
        const redirectUri = encodeURIComponent("https://www.thinmelon.cc/authorization/oauth2");
        // const redirectUri = encodeURIComponent("https://www.thinmelon.cc/oauth2");
        const requestForCodeUri = util.format(__REQ_CODE__, __APP_ID__, redirectUri, 'code', 'snsapi_userinfo', encodeURIComponent(path));

        __LOGGER__.info("URI: " + requestForCodeUri);
        __REQUEST__.doHttpsGet(requestForCodeUri, function (data) {
            __LOGGER__.info("RESULT: " + data);
        });
        return deferred.promise;
    },

    /**
     * 通过code换取网页授权access_token
     * @param req
     * @returns {*|jQuery.promise|promise|Promise}
     */
    requestForAccessToken: function (req) {
        var deferred = Q.defer();
        const requestForAccessTokenUri = util.format(__REQ_WEBPAGE_ACCESS_TOKEN__, __APP_ID__, __APP_SECRET__, req.code, 'authorization_code');

        __REQUEST__.doHttpsGet(requestForAccessTokenUri, function (data) {
            var response = JSON.parse(data);
            // 解析
            if (response.hasOwnProperty('errmsg')) {
                // 错误信息示例：
                // -- "errcode":40163,"errmsg":"code been used, hints: [ req_id: 7_5aDa0305th56 ]"
                deferred.reject(response.errmsg);
            } else {
                // 返回结果示例：
                // {
                // "access_token":"7_i1-gvZhgqBeNzsximr-J5_VJun_gognm-UMIDdQO3qFJAaAXXUzDirucGcLJZGxwfv9UGGyqJPqVbGnyQzUKfA",
                // "expires_in":7200,
                // "refresh_token":"7_hm6n4DwWiFl4ouTEAdfLtCtQz7UnCZUXjJqzPeAtIs5hqLpbUSamX-7F7ip9CfMOtQ-ErhHMw6GZAlP8RJ3r5w",
                // "openid":"oCPHfsjWqQWPA-U0DDMlqrkhvfm8",
                // "scope":"snsapi_userinfo"
                // }
                deferred.resolve({
                    token: response.access_token,
                    openid: response.openid
                });
            }
        });
        return deferred.promise;
    },

    /**
     * 拉取用户信息(需scope为 snsapi_userinfo)
     * @param req
     * @returns {*|jQuery.promise|promise|Promise}
     */
    requestForUserInfo: function (req) {
        var deferred = Q.defer();
        __LOGGER__.info(req);
        const requestForUserInfoUri = util.format(__REQ_USER_INFO__, req.token, req.openid);

        __LOGGER__.info("URI: " + requestForUserInfoUri);
        __REQUEST__.doHttpsGet(requestForUserInfoUri, function (data) {
            var response = JSON.parse(data);
            // 解析
            if (response.hasOwnProperty('errmsg')) {
                // 错误信息示例：
                // {
                // "errcode":40001,
                // "errmsg":"invalid credential, access_token is invalid or not latest, hints: [ req_id: hahXPa0999s156 ]"}
                // }
                deferred.reject(response.errmsg);
            } else {
                // 返回结果示例：
                // {
                //  openid: 'oCPHfsjWqQWPA-U0DDMlqrkhvfm8',
                //  nickname: '李云鹏',
                //  sex: 1,
                //  language: 'zh_CN',
                //  city: '黄金海岸',
                //  province: '昆士兰',
                //  country: '澳大利亚',
                //  headimgurl: 'http://thirdwx.qlogo.cn/mmopen/vi_32/DYAIOgq83erD8TmhGS69voWHHjGVUt7R1Ie8wzO6EImVrApicLibjrPXxtRH2D4pD0RlhaTfMAIaUhVny2lH1eXw/132',
                //  privilege: []
                // }
                deferred.resolve(JSON.parse(data));
            }
        });
        return deferred.promise;
    },

    /**
     *
     * 获取签名（供客户端调用）
     *
     * 一、 签名生成规则
     * 1. 参与签名的字段
     *    noncestr（随机字符串）, 有效的jsapi_ticket, timestamp（时间戳）, url（当前网页的URL，不包含#及其后面部分）
     * 2. 签名算法
     *    （1）对所有待签名参数按照字段名的ASCII 码从小到大排序（字典序）后，
     *    （2）使用URL键值对的格式（即key1=value1&key2=value2…）拼接成字符串string1。
     * 3. 注意事项：
     *    - 所有参数名均为小写字符。对string1作sha1加密，字段名和字段值都采用原始值，不进行URL 转义。
     *    - 签名用的noncestr和timestamp必须与wx.config中的nonceStr和timestamp相同
     *    - 签名用的url必须是调用JS接口页面的完整URL
     *    - 出于安全考虑，开发者必须在服务器端实现签名的逻辑
     *    - 确保你获取用来签名的url是动态获取的
     *      如果是html的静态页面在前端通过ajax将url传到后台签名，前端需要用js获取当前页面除去'#'hash部分的链接
     *      （可用location.href.split('#')[0]获取,而且需要encodeURIComponent）
     *      因为页面一旦分享，微信客户端会在你的链接末尾加入其它参数，如果不是动态获取当前链接，将导致分享后的页面签名失败
     */

    /**
     * 拉取AccessToken
     * @returns {*|jQuery.promise|promise|Promise}
     */
    getRealtimeAccessToken: function (params) {
        const deferred = Q.defer();
        __REQUEST__.doHttpsGet(__REQ_API_ACCESS_TOKEN__, function (data) {
            __LOGGER__.info("==> getRealtimeAccessToken: " + data);
            const result = JSON.parse(data);
            if (result.hasOwnProperty('access_token')) {
                deferred.resolve({
                    params: params,
                    accessToken: result.access_token
                });
            } else {
                deferred.reject(result);
            }
        });
        return deferred.promise;
    },

    /**
     * 拉取jsapi_ticket
     * @param request
     * @returns {*|jQuery.promise|promise|Promise}
     */
    getRealJsapiTicket: function (request) {
        const deferred = Q.defer();
        const requestForJsapiTicketUrl = util.format(__REQ_API_JSAPI_TICKET__, request.accessToken, 'jsapi');
        __REQUEST__.doHttpsGet(requestForJsapiTicketUrl, function (data) {
            __LOGGER__.info("==> getRealJsapiTicket: " + data);
            const result = JSON.parse(data);
            if (result.hasOwnProperty('ticket')) {
                deferred.resolve({
                    params: request.params,
                    jsApiTicket: result.ticket
                });
            } else {
                deferred.reject(result);
            }
        });
        return deferred.promise;
    },

    getNonceStr: function (length) {
        const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        const count = chars.length;
        var i, nonceStr = "";
        for (i = 0; i < length; i++) {
            nonceStr += chars.substr(Math.floor(Math.random() * (count - 1) + 1), 1);
        }
        return nonceStr;
    },

    getSignature: function (request) {
        const deferred = Q.defer();
        const nonceStr = CredentialService.getNonceStr(16);
        const timestamp = new Date().getTime();
        var rawString = util.format("jsapi_ticket=%s&noncestr=%s&timestamp=%s&url=%s",
            request.jsApiTicket, nonceStr, timestamp, request.params.url);

        __LOGGER__.info("==> getSignature - RAW: " + rawString);
        deferred.resolve({
            timestamp: timestamp,               // 必填，生成签名的时间戳
            nonceStr: nonceStr,                 // 必填，生成签名的随机串
            signature: sha1(rawString)          // 必填，签名，见附录1
        });
        return deferred.promise;
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

module.exports = CredentialService;

 CredentialService
    .requestForCode('report');

//CredentialService
//    .getRealtimeAccessToken({url: 'http://www.thinmelon.cc/report/list'})
//    .then(CredentialService.getRealJsapiTicket)
//    .then(CredentialService.getSignature)
//    .then(function (result) {
//        __LOGGER__.debug(result);
//    })
//    .catch(function (err) {
//        __LOGGER__.error(err);
//    });
