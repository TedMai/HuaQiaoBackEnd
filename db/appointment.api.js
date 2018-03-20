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
        const rid = RANDOM.getNonceStr(32);
        const appointment = new Date();

        HANDLER
            .setUpConnection({
                sqlBasicInfo: EXEC_SQL.addAppointment,
                sqlIsRepeat: EXEC_SQL.checkRepeatAppointment,
                information: {
                    rid: rid,
                    schedule: request.body.schedule,
                    patient: request.body.patient,
                    appointment: appointment
                },
                checkCondition: [
                    request.body.schedule,
                    request.body.patient
                ]
            })
            .then(HANDLER.beginTransaction)
            .then(HANDLER.isRepeat)
            .then(HANDLER.setBasicInfo)
            .then(HANDLER.commitTransaction)
            .then(HANDLER.cleanup)
            .then(function (result) {
                // 修饰结果
                // 添加插入ID数据
                // 其余数据原路返回
                response({
                    code: result.code,
                    msg: {
                        insertId: rid,
                        appointment: appointment,
                        result: result.msg
                    }
                });
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
                updateDataSet: [
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
                HANDLER.onRejectWithRollback(request, response);
            });
    },

    /**
     * 查询指定的预约订单详情
     * @param request
     * @param response
     */
    querySpecificAppointment: function (request, response) {
        HANDLER
            .setUpConnection({
                appointment: {
                    sql: EXEC_SQL.fetchSpecificAppointment,
                    values: request.params.id
                }
            })
            .then(HANDLER.fetchDataSet)
            .then(HANDLER.cleanup)
            .then(function (result) {
                response(result);
            })
            .catch(function (request) {
                HANDLER.onReject(request, response);
            });
    },

    /**
     * 获取指定用户的预约挂号信息列表
     * @param request
     * @param response
     */
    queryRelativeAppointments: function (request, response) {

        HANDLER
            .setUpConnection({
                appointments: {
                    sql: EXEC_SQL.fetchRelativeAppointments,
                    values: request.params.id
                }
            })
            .then(HANDLER.fetchDataSet)
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