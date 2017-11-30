const HANDLER = require('./mysql.handler');
const EXEC_SQL = require('./schedule.interface');

var api = {

    /**
     * 新增 - 排班
     * @param request
     * @param response
     */
    addSchedule: function (request, response) {

        HANDLER
            .setUpConnection({
                sqlBasicInfo: EXEC_SQL.addSchedule,
                // information: request.body.information,
                information: {
                    doctor: 25,
                    visiting: new Date(),
                    section: 0,
                    registerFee: 1.11,
                    medicalFee: 128.56,
                    openNumber: 1
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
     * 编辑 - 排班
     * @param request
     * @param response
     */
    editSchedule: function (request, response) {

        HANDLER
            .setUpConnection({
                sqlUpdateInfo: EXEC_SQL.editSchedule,
                // information: [request.body.information, request.query.id]
                information: [
                    {
                        doctor: 25,
                        visiting: new Date(),
                        section: 1,
                        registerFee: 0.11,
                        medicalFee: 12.56,
                        openNumber: 1000
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
     * 删除 - 排班
     * @param request
     * @param response
     */
    deleteSchedule: function (request, response) {

        HANDLER
            .setUpConnection({
                index: 0,
                execSQLs: [
                    EXEC_SQL.deleteSchedule
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
     * 批量插入 - 排班
     * @param request
     * @param response
     */
    batchInsertSchedule: function (request, response) {

    },

    /**
     * 获取 - 排班信息
     * @param request
     * @param response
     */
    fetchSchedule: function (request, response) {


    }
};

module.exports = api;