const Q = require('q');
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
//const __APP_ID__ = "wx1133464776a7a161";
//const __APP_SECRET__ = "c3eceda5d7c37f7fd74b7f5da2638638";
//const __REQ_ACCESS_TOKEN__ = "https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=" + __APP_ID__ + "&secret=" + __APP_SECRET__;
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
 * 该access_token用于调用其他接口
 * @type {string}
 * @private
 */
const __REQ_API_ACCESS_TOKEN__ = "https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=" + __APP_ID__ + "&secret=" + __APP_SECRET__;
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
     * 微信公众号网页
     */
    getAppID: function () {
        return __APP_ID__;
    },

    getRealtimeAccessToken: function () {
        const deferred = Q.defer();
        __REQUEST__.doHttpsGet(__REQ_API_ACCESS_TOKEN__, function (data) {
            __LOGGER__.info("==> getRealtimeAccessToken: " + data);
            const result = JSON.parse(data);
            if (result.hasOwnProperty('access_token')) {
                deferred.resolve(result.access_token);
            } else {
                deferred.reject(result);
            }
        });
        return deferred.promise;
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
     * 微信小程序
     */
    fetchUserOpenId: function (code, response) {
        __REQUEST__.doHttpsGet(util.format(__REQ_OPENID__, __APP_ID_MINI_PROGRAM__, __APP_SECRET_MINI_PROGRAM__, code), function (data) {
            response(JSON.parse(data));
        });
    }

};

module.exports = CredentialService;

//CredentialService.requestForCode('report');
