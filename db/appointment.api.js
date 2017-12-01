const HANDLER = require('./mysql.handler');
const EXEC_SQL = require('./appointment.interface');
const RANDOM = require('./utility.signature');

var api = {

    /**
     * 新增 - 预约挂号
     * @param request
     * @param response
     */
    addAppointment: function (request, response) {

        HANDLER
            .setUpConnection({
                sqlBasicInfo: EXEC_SQL.addAppointment,
                // information: request.body.information,
                information: {
                    rid: RANDOM.getNonceStr(32),
                    schedule: 3,
                    patient: 4,
                    appointment: new Date()
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

    /**
     * 编辑 - 预约挂号
     * @param request
     * @param response
     */
    editAppointment: function (request, response) {

        HANDLER
            .setUpConnection({
                sqlUpdateInfo: EXEC_SQL.editAppointment,
                // information: [request.body.information, request.query.id]
                information: [
                    {
                        schedule: 3,
                        patient: 4,
                        appointment: new Date()
                    },
                    request.query.id
                ]
            })
            .then(HANDLER.beginTransaction)
            .then(HANDLER.updateBasicInfo)
            .then(HANDLER.commitTransaction)
            .then(HANDLER.cleanup)
            .then(function (result) {
                response(result);
            })
            .catch(function (request) {
                HANDLER.onReject(request, response);
            });
    },

    /**
     * 删除 - 预约挂号
     * @param request
     * @param response
     */
    deleteAppointment: function (request, response) {

        HANDLER
            .setUpConnection({
                index: 0,
                execSQLs: [
                    EXEC_SQL.deleteAppointment
                ],
                information: [request.params.id]
            })
            .then(HANDLER.beginTransaction)
            .then(HANDLER.deleteDataSet)
            .then(HANDLER.commitTransaction)
            .then(HANDLER.cleanup)
            .then(function (result) {
                response(result);
            })
            .catch(function (request) {
                HANDLER.onReject(request, response);
            });
    },

    /**
     * 获取 - 预约挂号信息
     * @param request
     * @param response
     */
    fetchAppointment: function (request, response) {


    }
};

module.exports = api;