const Q = require('q');
const HANDLER = require('./mysql.handler');
const EXEC_SQL = require('./patient.idcard.interface');
const log4js = require("../services/log4js.service");
const LOGGER = log4js.getLogger("default");

var api = {

    bindPatientIDCard: function (request, response) {
        HANDLER
            .setUpConnection({
                /**
                 * 1. 取得openid
                 */
                sqlSpecificRow: EXEC_SQL.getOpenid,
                specificCondition: [request.body.session],
                /**
                 * 2. 新增就诊卡
                 */
                sqlBasicInfo: EXEC_SQL.bindPatientIDCard,
                information: {
                    cardid: request.body.cardid,
                    name: request.body.name,
                    phone: request.body.phone,
                    openid: ''
                }
            })
            .then(HANDLER.beginTransaction)
            .then(HANDLER.fetchSpecificRow)
            .then(api.modifyParams)
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

    modifyParams: function (request) {
        var deferred = Q.defer();

        LOGGER.info("==>   modifyParams with result");
        LOGGER.debug(request.result);
        request.params.information.openid = request.result[0].wechat;
        LOGGER.debug(request.params.information);
        deferred.resolve(request);

        return deferred.promise;
    },

    removePatientIdCard: function (request, response) {
        HANDLER
            .setUpConnection({
                index: 0,
                execSQLs: [
                    EXEC_SQL.removePatientIdCard
                ],
                information: [request.body.cardid]
            })
            .then(HANDLER.beginTransaction)
            .then(HANDLER.deleteDataSet)
            .then(HANDLER.commitTransaction)
            .then(HANDLER.cleanup)
            .then(function (result) {
                response(result);
            })
            .catch(function (request) {
                HANDLER.onRejectWithRollback(request, response);
            });
    },

    isPatientIDCardExist: function (request, response) {
        HANDLER
            .setUpConnection({
                sqlIsExist: EXEC_SQL.isPatientIDCardExist,
                queryCondition: [
                    request.openid
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
    },

    fetchCardList: function (request, response) {
        HANDLER
            .setUpConnection({
                execSQL: EXEC_SQL.fetchCardList,
                values: [request.query.session]
            })
            .then(HANDLER.fetchList)
            .then(HANDLER.cleanup)
            .then(function (result) {
                response(result);
            })
            .catch(function (request) {
                HANDLER.onReject(request, response);
            });
    },

    getPhoneInCard: function (request, response) {
        HANDLER
            .setUpConnection({
                execSQL: EXEC_SQL.getPhoneInCard,
                values: [request.body.cardid]
            })
            .then(HANDLER.fetchList)
            .then(HANDLER.cleanup)
            .then(function (result) {
                response(result);
            })
            .catch(function (request) {
                HANDLER.onReject(request, response);
            });
    },

    isBound: function (request, response) {
        /**
         * 1. 验证手机号码有效性
         * 2. 根据手机号码及用户输入的姓名，远程校验是否存在相应的就诊卡
         * 3. 存在，获取就该卡ID，校验用户是否已经绑定该张就诊卡
         * 4. 验证都通过后，绑定该张就诊卡，就诊卡ID + openid
         */
        HANDLER
            .setUpConnection({
                sqlIsRepeat: EXEC_SQL.isBound,
                checkCondition: [
                    request.session,
                    request.cardid
                ]
            })
            .then(HANDLER.isRepeat)
            .then(HANDLER.cleanup)
            .then(function () {
                response({
                    code: 0,
                    cardid: request.cardid
                });
            })
            .catch(function (request) {
                HANDLER.onReject(request, response);
            });
    }
};

module.exports = api;

// api.bindPatientIDCard({}, function (response) {
//     console.log(response);
// });

//api.fetchCardList({query: {session: 'VcT2yIm0rCPsGsmmgVX01IGKZ3gxvZhH'}}, function (result) {
//    console.log(result);
//});
