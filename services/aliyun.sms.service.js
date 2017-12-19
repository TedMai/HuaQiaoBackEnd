const express = require('express');
const log4js = require("../services/log4js.service");

const __ROUTER__ = express.Router();
const __LOGGER__ = log4js.getLogger("default");
const __CRYPTO__ = require('crypto');

const __ACCESS_KEY_ID__ = "LTAIbY9XZlXXFGwa";
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

function AliyunSMSService(AccessKeyId, AccessKeySecret) {

    this.sendSMS = function (args) {

    };

    // this.getRandomStr = function (length) {
    //     return Array.from({length}).map((value) => {
    //             return Math.floor(Math.random() * 10)
    //         }).join('');
    // };
    //
    // this.getSignature = function(params) {
    //     var paramsStr = this.toQueryString(params);
    //     var signTemp = `POST&${encodeURIComponent('/')}&${encodeURIComponent(paramsStr)}`;
    //     let signature = __CRYPTO__.createHmac('sha1', `${this.AccessKeySecret}&`).update(signTemp).digest('base64');
    //     return signature;
    // };

    this.toQueryString = function(params) {
        // return Object.keys(params).sort().map(key => {
        //         return `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`
        //     }).join('&')
    };
}

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