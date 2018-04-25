// const Q = require('q');
const __CHEERIO__ = require('cheerio');
const __REQUEST__ = require('./request.service');
const log4js = require('./log4js.service');
const __LOGGER__ = log4js.getLogger(__filename);
const __UTIL__ = require('util');
const __CHINA_BOND__ = 'http://yield.chinabond.com.cn/cbweb-pbc-web/pbc/historyQuery?startDate=%s&endDate=%s&gjqx=0&qxId=hzsylqx&locale=cn_ZH';

var financeService = {
    /**
     * 中债国债收益率曲线
     *      获取一年期及十年期国债收益率数据算出收益率差
     *      判断短期及长期信心指数
     * 数据来源： 中国人民银行官网
     * @param request
     * @param response
     */
    getChinaTreasuryYields: function (request, response) {
        __REQUEST__.doHttpGet(__UTIL__.format(__CHINA_BOND__, request.params.from, request.params.to), function (result) {
            var date = [], oneYear = [], tenYear = [], children;
            // 加载网页
            const $ = __CHEERIO__.load(result, {
                xml: {
                    normalizeWhitespace: true
                }
            });
            __LOGGER__.debug('网页解析是否正确: ' + $('tr', '#gjqxData').is('tr'));
            if ($('tr', '#gjqxData').is('tr')) {
                // 开始解析
                $('tr', '#gjqxData').next().each(function (i, element) {
                    children = $(this).children('td');
                    date[i] = children.eq(1).text();            // 日期
                    oneYear[i] = children.eq(4).text();         // 一年国债
                    tenYear[i] = children.eq(8).text();         // 十年国债
                });
                // __LOGGER__.debug({date: date, oneYear: oneYear, tenYear: tenYear});
                response({code: 0, date: date, oneYear: oneYear, tenYear: tenYear});
            } else {
                response({code: -100, msg: '解析过程发生错误'});
            }
        });
    }
};

module.exports = financeService;

// financeService.getChinaTreasuryYields();
