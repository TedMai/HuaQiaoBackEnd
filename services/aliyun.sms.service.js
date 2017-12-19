const http = require('http');
const log4js = require("../services/log4js.service");
const querystring = require("querystring");

const __LOGGER__ = log4js.getLogger("default");
const __CRYPTO__ = require('crypto');
//阿里短信服务所用的密钥
const __ACCESS_KEY_ID__ = "LTAIbY9XZlXXFGwa";
//阿里短信服务所用的密钥值
const __ACCESS_KEY_SECRET__ = "4G0J0IfHV9WNoR2jUeIYos5Qs47dXu";
//短信API产品名
const __PRODUCT_NAME__ = "Dysmsapi";
//短信API产品域名
const __PRODUCT_DOMAIN__ = "dysmsapi.aliyuncs.com";
//暂时不支持多Region
const __PRODUCT_REGION__ = "cn-hangzhou";
//短信签名
const __SMS_SIGN_NAME__ = "花管家";
//短信模版
const __SMS_TEMPLATE_NOTIFY_CODE__ = "SMS_76440023";
const __SMS_TEMPLATE_VERIFY_CODE__ = "SMS_84460009";

var AliyunSMSService = {
    //配置
    config: {
        AccessKeyId: __ACCESS_KEY_ID__,
        AccessKeySecret: __ACCESS_KEY_SECRET__,
        Format: 'JSON',
        SignatureMethod: 'HMAC-SHA1',
        SignatureVersion: '1.0',

        Action: 'SendSms',
        Version: '2017-05-25',
        RegionId: __PRODUCT_REGION__
    },
    //发送POST请求
    doPost: function (data, callback) {
        const postData = querystring.stringify(data);
        const options = {
            host: __PRODUCT_DOMAIN__,
            port: 80,
            path: '',
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Content-Length': Buffer.byteLength(postData)
            }
        };
        const req = http.request(options, function (res) {
            res.on('data', function (chunk) {
                __LOGGER__.info('返回结果：' + chunk);
                callback(JSON.parse(chunk));
            });
            res.on('end', function () {
                __LOGGER__.info('===== 结束 =====');
            });
        });
        req.on('error', function (e) {
            __LOGGER__.error(e.message);
            callback({'error': e.message});
        });
        req.write(postData);
        req.end();
    },
    //签名算法
    sign: function (param) {
        var json = {}, p = Object.keys(param).sort();
        for (var i = 0; i < p.length; i++) {
            json[p[i]] = param[p[i]];
        }
        return __CRYPTO__
            .createHmac('sha1', param.AccessKeySecret + '&')
            .update(new Buffer('POST&' + encodeURIComponent('/') + '&' + encodeURIComponent(querystring.stringify(json, '&', '=')), 'utf-8'))
            .digest('base64');
    },
    //发送短信
    send: function (data, callback) {
        var params;

        data.SignatureNonce = Math.random().toString();
        data.Timestamp = new Date().toISOString();
        data.SignName = __SMS_SIGN_NAME__;                        //短信签名
        data.TemplateCode = __SMS_TEMPLATE_NOTIFY_CODE__;         //短信模板
        params = Object.assign(data, this.config);
        params.Signature = this.sign(params);
        this.doPost(params, function (data) {
            callback(data);
        });
    }

};

module.exports = AliyunSMSService;

//AliyunSMSService.send({
//    PhoneNumbers: '18159393355',                        //接收短信的手机，逗号隔开，最多20个号码
//    TemplateParam: JSON.stringify({})                   //短信模板中参数指定
//}, function (data) {
//    if (data.hasOwnProperty("Code") && data.Code === "OK") {
//        __LOGGER__.info(data.RequestId);
//    }
//    // 发送成功返回 {"Message":"OK","RequestId":"205BE12C-565E-42E0-8487-1651832850CA","BizId":"861200213687445470^0","Code":"OK"}
//    // 失败没有OK，有具体错误提示，以此判断是否发送成功
//});

//function AliyunSMSService(AccessKeyId, AccessKeySecret) {
//
//    this.sendSMS = function (args) {
//
//    };
//
//    this.getRandomStr = function (length) {
//        var randomStr = '';
//        for (var i = 0; i < length; i++) {
//            randomStr += Math.floor(Math.random() * 10);
//        }
//        return randomStr;
//    };
//
//    this.getSignature = function (params) {
//        var paramsStr = this.toQueryString(params);
//        var signTemp = 'POST&' + encodeURIComponent('/') + '&' + encodeURIComponent(paramsStr);
//        let signature = __CRYPTO__.create('sha1', __ACCESS_KEY_SECRET__ + '&').update(signTemp).digest('base64');
//        return signature;
//    };
//
//    this.toQueryString = function (params) {
//        return Object.keys(params).sort().map(function (key) {
//            return encodeURIComponent(key) + '=' + encodeURIComponent(params[key]);
//        }).join('&')
//    };
//}

//var params = {
//    Version: '2017-05-25',
//    Format: 'JSON',
//    SignatureMethod: 'HMAC-SHA1',
//    SignatureNonce: this.getRandomStr(25),
//    SignatureVersion: '1.0',
//    AccessKeyId: this.AccessKeyId,
//    Timestamp: new Date().toISOString()
//};

//var sms = new AliyunSMSService("", "");
//sms.toQueryString(params);
//console.info(sms.toQueryString(params));
//console.info(sms.getRandomStr(32));

// class SMS {
//     constructor({AccessKeyId = '', AccessKeySecret = ''}) {
//         this.AccessKeyId = AccessKeyId
//         this.AccessKeySecret = AccessKeySecret
//         this.api = 'https://dysmsapi.aliyuncs.com/'
//     }
//
//     send(args) {
//         let params = {
//             Version: '2017-05-25',
//             Format: 'JSON',
//             SignatureMethod: 'HMAC-SHA1',
//             SignatureNonce: this.getRandomStr(25),
//             SignatureVersion: '1.0',
//             AccessKeyId: this.AccessKeyId,
//             Timestamp: new Date().toISOString()
//         }
//         Object.assign(params, args)
//         params.Signature = this.getSignature(params)
//         return new Promise((resolve, reject) = > {
//             request({
//                         method: 'POST',
//                         url: this.api,
//             headers
//     :
//         {
//             'cache-control'
//         :
//             'no-cache',
//                 'content-type'
//         :
//             'application/x-www-form-urlencoded'
//         }
//     ,
//         form: params
//     },
//         (error, response, body) =
//     >
//         {
//             if (response.statusCode === 201 || response.statusCode === 200) {
//                 resolve(body)
//             } else {
//                 reject(body, error)
//             }
//         }
//     )
//     })
//     }
//
//     getRandomStr(length) {
//         return Array.from({length}).map((value) = > {
//                 return Math.floor(Math.random() * 10)
//             }
//     ).
//         join('')
//     }
//
//     getSignature(params) {
//         let paramsStr = this.toQueryString(params)
//         let signTemp = `POST&${encodeURIComponent('/')}&${encodeURIComponent(paramsStr)}`
//         let signature = crypto.createHmac('sha1', `${this.AccessKeySecret}&`).update(signTemp).digest('base64')
//         return signature
//     }
//
//     toQueryString(params) {
//         return Object.keys(params).sort().map(key = > {
//                 return `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`
//             }
//     ).
//         join('&')
//     }
// }
//
// module.exports = SMS

//const SMS = require('../lib')
//
//const sms = new SMS({
//    AccessKeyId: '123',
//    AccessKeySecret: '123'
//})
//
//sms.send({
//    Format: 'JSON',
//    Action: 'SendSms',
//    TemplateParam: '{"code":"1234"}',
//    PhoneNumbers: '13516534108',
//    SignName: '北京月文化',
//    TemplateCode: 'SMS_77730013'
//}).then((result) => {
//    console.log(result)
//}).catch(err => {
//    console.log(err)
//})