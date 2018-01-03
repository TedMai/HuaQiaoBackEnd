const HANDLER = require('./mysql.handler');
const EXEC_SQL = require('./sms.interface');

var api = {

    /**
     * 保存短信
     *      -   requestId
     *      -   bizId
     * @param request
     * @param response
     */
    addSms: function (request, response) {
        HANDLER
            .setUpConnection({
                sqlBasicInfo: EXEC_SQL.addSms,
                information: {
                    requestId: request.result.RequestId,
                    bizId: request.result.BizId,
                    phone: request.phoneNumber,
                    verificationCode: request.verificationCode,
                    errCode: request.result.Code
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

    checkSms: function (request, response) {
        HANDLER
            .setUpConnection({
                sqlIsExist: EXEC_SQL.checkSms,
                information: [
                    request.body.requestId,
                    request.body.bizId,
                    request.body.phone,
                    request.body.verificationCode
                ]
            })
            .then(HANDLER.isExist)
            .then(HANDLER.cleanup)
            .then(function (result) {
                response(result);
            })
            .catch(function (request) {
                HANDLER.onReject(request, response);
            });
    }
};

module.exports = api;