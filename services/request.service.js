const http = require('http');
const https = require('https');
const urlparser = require('url');
const querystring = require("querystring");
const log4js = require("../services/log4js.service");
const __LOGGER__ = log4js.getLogger("default");

var RequestService = {
    /**
     * GET 请求 -- HTTPS
     * @param url
     * @param callback
     */
    doHttpsGet: function (url, callback) {
        __LOGGER__.info("doHttpsGet ==> " + url);
        https.get(url, function (response) {
            response.on('data', function (chunk) {
                __LOGGER__.info('=====  返回结果：' + chunk);
                callback(chunk);
            });
            response.on('end', function () {
                __LOGGER__.info('===== 结束【doHttpsGet】 =====');
            });
        }).on('error', function (error) {
            __LOGGER__.error(error);
        });
    },

    /**
     * POST 请求 -- HTTPS
     * @param url
     * @param data
     * @param callback
     */
    doHttpsPost: function (url, data, callback) {
        const tmp = urlparser.parse(url);
        const postData = JSON.stringify(data);
        __LOGGER__.info("=====  doHttpPost2 ==> postData: " + postData);
        const isHttp = tmp.protocol === 'http:';
        const options = {
            host: tmp.hostname,
            port: tmp.port || (isHttp ? 80 : 443),
            path: tmp.path,
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Content-Length': Buffer.byteLength(postData)
            }
        };
        __LOGGER__.info("=====  doHttpPost2 ==> URL: " + url);
        __LOGGER__.info("=====  doHttpPost2 ==> options: " + JSON.stringify(options));
        const req = https.request(options, function (res) {
            res.on('data', function (chunk) {
                __LOGGER__.info('=====  返回结果：' + chunk);
                callback(chunk);
            });
            res.on('end', function () {
                __LOGGER__.info('===== 结束【doHttpsPost】=====');
            });
        });
        req.on('error', function (e) {
            __LOGGER__.error(e.message);
        });
        req.write(postData);
        req.end();
    },

    /* ---------------------------------------------------------------------------------- */

    /**
     * POST请求 -- HTTP
     * @param host
     * @param port
     * @param data
     * @param callback
     */
    doHttpPost: function (host, port, data, callback) {
        const postData = querystring.stringify(data);
        const options = {
            host: host,
            port: port,
            path: '',
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Content-Length': Buffer.byteLength(postData)
            }
        };
        __LOGGER__.info("=====  doHttpPost ==> options: " + JSON.stringify(options));
        const req = http.request(options, function (res) {
            res.on('data', function (chunk) {
                __LOGGER__.info('=====  返回结果：' + chunk);
                callback(chunk);
            });
            res.on('end', function () {
                __LOGGER__.info('===== 结束【doHttpPost】 =====');
            });
        });
        req.on('error', function (e) {
            __LOGGER__.error(e.message);
        });
        req.write(postData);
        req.end();
    }


};

module.exports = RequestService;