const HANDLER = require('./mysql.handler');
const EXEC_SQL = require('./sms.interface');
const log4js = require("../services/log4js.service");
const LOGGER = log4js.getLogger("default");

var api = {

    /**
     * 保存短信
     *      -   requestId
     *      -   bizId
     * @param request
     * @param response
     */
    addSms: function (request, response) {
        LOGGER.info(request.result);
        HANDLER
            .setUpConnection({
                sqlBasicInfo: EXEC_SQL.addSms,
                information: {
                    requestId: request.result.RequestId,
                    bizId: request.result.BizId,
                    phone: request.phoneNumber,
                    verificationCode: request.verificationCode
                }
            })
            .then(HANDLER.beginTransaction)
            .then(HANDLER.setBasicInfo)
            .then(HANDLER.commitTransaction)
            .then(HANDLER.cleanup)
            .then(function (result) {
                response(result);
            })
            .catch(function (request) {
                HANDLER.onRejectWithRollback(request, response);
            });
    },

    updateMessage: function (request, response) {

    },

    checkMessage: function (reqeust, response) {

    }
};

module.exports = api;