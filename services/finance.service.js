const __CHEERIO__ = require("cheerio");
const __REQUEST__ = require("./request.service");
const log4js = require("./log4js.service");
const __LOGGER__ = log4js.getLogger("default");

var financeService = {
    getChinaTreasuryYields: function (request) {
        __REQUEST__.doHttpGet('http://yield.chinabond.com.cn/cbweb-pbc-web/pbc/historyQuery?startDate=2018-04-11&endDate=2018-04-11&gjqx=0&qxId=hzsylqx&locale=cn_ZH', function (result) {
            const $ = __CHEERIO__.load(result);
            $('#gjqxData table tr td').each(function (i, element) {
                __LOGGER__.info($(this).text());
            });
        });
    }
};

module.exports = financeService;

financeService.getChinaTreasuryYields();
