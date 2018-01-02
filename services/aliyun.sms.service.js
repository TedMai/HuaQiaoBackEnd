const querystring = require("querystring");
const log4js = require("./log4js.service");
const __REQUEST__ = require("./request.service");

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
//验证码长度
const __CODE_LENGTH__ = 6;

var AliyunSMSService = {
    /**
     * 属性
     */
    verificationCode: '',
    phone: '',

    /**
     *  参数配置
     */
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

    /**
     * 签名算法
     * @param param
     * @returns {*}
     */
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

    /**
     *  触发请求
     * @param data
     * @param callback
     */
    trigger: function (data, callback) {
        var
            that = this,
            params;

        data.SignatureNonce = Math.random().toString();
        data.Timestamp = new Date().toISOString();
        params = Object.assign(data, this.config);
        params.Signature = this.sign(params);
        __REQUEST__.doHttpPost(__PRODUCT_DOMAIN__, 80, params, function (data) {
            callback({
                phoneNumber: that.phone,
                verificationCode: that.verificationCode,
                result: JSON.parse(data)
            });
        });
    },

    generate: function (length) {
        var
            i,
            chars = "0123456789",
            verificationCode = "",
            count = chars.length - 1;

        for (i = 0; i < length; i++) {
            verificationCode = verificationCode.concat(chars.substr(parseInt(Math.random() * count), 1));
        }
        return verificationCode;
    },

    /**
     *  选择短信类别
     * @param request
     * @param response
     */
    send: function (request, response) {
        switch (request.params.type) {
            case "0":   // 验证码
                this.verificationCode = this.generate(__CODE_LENGTH__);
                this.phone = request.params.phone;
                __LOGGER__.debug("AliyunSMSService ==> send sms | " + this.verificationCode);
                this.trigger({
                    SignName: __SMS_SIGN_NAME__,                        //短信签名
                    TemplateCode: __SMS_TEMPLATE_VERIFY_CODE__,         //短信模板
                    PhoneNumbers: this.phone,                 //接收短信的手机，逗号隔开，最多20个号码
                    TemplateParam: JSON.stringify({                     //短信模板中参数指定
                        code: this.verificationCode
                    })
                }, response);
                break;
            case "1":   // 确认短信
                __LOGGER__.debug("AliyunSMSService ==> send sms");
                this.trigger({
                    SignName: __SMS_SIGN_NAME__,                        //短信签名
                    TemplateCode: __SMS_TEMPLATE_NOTIFY_CODE__,         //短信模板
                    PhoneNumbers: request.params.phone                  //接收短信的手机，逗号隔开，最多20个号码
                }, response);
                break;
            default:
                break;
        }
    }
};

module.exports = AliyunSMSService;