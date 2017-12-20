const http = require('http');

var CredentailService = {
    doGet: function () {
        http.get("https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=APPID&secret=APPSECRET")
    },

    getRealtimeAccessToken: function () {

    }
};