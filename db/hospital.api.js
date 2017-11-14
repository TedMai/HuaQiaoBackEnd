const HANDLER = require('./mysql.handler');
const EXEC_SQL = require('./hospital.interface');

var api = {

    /**
     * 新增 - 医院
     * @param request
     * @param response
     */
    addHospital: function (request, response) {

        HANDLER.transformRequest(request);

        HANDLER
            .setUpConnection({
                sqlBasicInfo: EXEC_SQL.addHospital,
                sqlInsertGallery: EXEC_SQL.insertHospitalGallery,
                information: request.body.information,
                gallery: request.body.gallery
            })
            .then(HANDLER.beginTransaction)
            .then(HANDLER.setBasicInfo)
            .then(HANDLER.insertGallery)
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
     * 编辑 - 医院
     * @param request
     * @param response
     */
    editHospital: function (request, response) {

        HANDLER.transformRequest(request);

        HANDLER
            .setUpConnection({
                sqlUpdateInfo: EXEC_SQL.editHospital,
                information: [request.body.information, request.query.id]
            })
            .then(HANDLER.updateBasicInfo)
            .then(HANDLER.cleanup)
            .then(function (result) {
                response(result);
            })
            .catch(function (request) {
                HANDLER.onRejectWithRollback(request, response);
            });
    },

    /**
     * 删除 - 医院
     * @param request
     * @param response
     */
    deleteHospital: function (request, response) {
        console.info("deleteHospital    ==>     ID: " + request.params.id);

        HANDLER
            .setUpConnection({
                index: 0,
                execSQLs: [
                    EXEC_SQL.deleteRelativeDoctors,
                    EXEC_SQL.deleteRelativeDepartments,
                    EXEC_SQL.deleteHospital
                ],
                information: [request.params.id]
            })
            .then(HANDLER.deleteDataSet)
            .then(HANDLER.cleanup)
            .then(function (result) {
                response(result);
            })
            .catch(function (request) {
                HANDLER.onReject(request, response);
            });
    },

    /**
     * 获取列表 - 医院
     * @param response
     */
    fetchHospitalList: function (response) {

        HANDLER
            .setUpConnection({
                tableName: 'hospital',
                execSQL: EXEC_SQL.fetchHospitalList,
                values: null
            })
            .then(HANDLER.fetchList)
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
