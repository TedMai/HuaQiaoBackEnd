module.exports =
    {
        /**
         * 获取随机字符串
         * @param length
         * @returns {string}
         */
        getNonceStr: function (length) {
            var
                i,
                chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
                nonceStr = "",
                count = chars.length - 1;

            for (i = 0; i < length; i++) {
                nonceStr = nonceStr.concat(chars.substr(parseInt(Math.random() * count), 1));
            }
            return nonceStr;
        }
    };