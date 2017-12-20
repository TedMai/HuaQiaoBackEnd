const http = require('http');

const __REQ_ACCESS_TOKEN__ = "https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=APPID&secret=APPSECRET";

var RequestService = {
    doGet: function (url) {
        //http.get(url, function (response) {
        //        const {statusCode} = res;
        //        const contentType = res.headers['content-type'];
        //
        //        var error;
        //        if (statusCode !== 200) {
        //            error = new Error('Request Failed.\n' +
        //                `Status Code: ${statusCode}`);
        //        } else if (!/^application\/json/.test(contentType)) {
        //            error = new Error('Invalid content-type.\n' +
        //                `Expected application/json but received ${contentType}`);
        //        }
        //        if (error) {
        //            console.error(error.message);
        //            // consume response data to free up memory
        //            res.resume();
        //            return;
        //        }
        //
        //        res.setEncoding('utf8');
        //        var rawData = '';
        //        res.on('data', (chunk) = > {rawData += chunk;
        //    })
        //        ;
        //        res.on('end', () = > {
        //            try {
        //                const parsedData = JSON.parse(rawData);
        //        console.log(parsedData);
        //    } catch
        //        (e)
        //        {
        //            console.error(e.message);
        //        }
        //    })
        //        ;
        //    }
        //).on('error', (e) = > {
        //    console.error(`Got error: ${e.message}`);
    //})
    //    ;
    },

    getAccessToken: function () {

    }
}