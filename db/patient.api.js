const HANDLER = require('./mysql.handler');
const EXEC_SQL = require('./patient.interface');

var api = {

    /**
     * 新增 - 病人
     * @param request
     * @param response
     */
    addPatient: function (request, response) {

        HANDLER
            .setUpConnection({
                sqlBasicInfo: EXEC_SQL.addPatient,
                sqlUpdateInfo: EXEC_SQL.batchSetDefault,
                sqlIsExist: EXEC_SQL.checkIsUserExist,
                information: request.body,
                // information: {
                //     name: '2345234532',
                //     sex: 1,
                //     identity: '350303198845661250',
                //     phone: '13956568878',
                //     address: '',
                //     isDefault: true,
                //     uid: 24
                // },
                queryCondition: [
                    request.body.uid
                ],
                updateDataSet: [
                    {
                        isDefault: 0
                    },
                    request.body.uid
                ],
                checkResult: request.body.isDefault === true
            })
            .then(HANDLER.beginTransaction)
            .then(HANDLER.isExist)
            .then(HANDLER.setColumnData)
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
     * 编辑 - 病人
     * @param request
     * @param response
     */
    editPatient: function (request, response) {

        HANDLER
            .setUpConnection({
                sqlUpdateInfo: EXEC_SQL.editPatient,
                // information: [request.body.information, request.query.id]
                updateDataSet: [
                    {
                        name: '李鹏',
                        sex: 1,
                        birthday: new Date(),
                        identity: '350303198512050048',
                        phone: '18760598086',
                        address: '福建莆田涵江',
                        openid: 'osCkO0a1sPv2YDNBIAw7wFXlTib4'
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
     * 删除 - 病人
     * @param request
     * @param response
     */
    deletePatient: function (request, response) {

        HANDLER
            .setUpConnection({
                index: 0,
                execSQLs: [
                    EXEC_SQL.deletePatient
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
     * 获取 - 病人信息
     * @param request
     * @param response
     */
    fetchPatient: function (request, response) {

    },

    queryRelativePatients: function (request, response) {

        HANDLER
            .setUpConnection({
                patients: {
                    sql: EXEC_SQL.fetchRelativePatients,
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