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
            .then(HANDLER.batchCopyWrapper)
            .then(HANDLER.insertGallery)
            .then(HANDLER.commitTransaction)
            .then(HANDLER.deepClean)
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
                sqlFetchGallery: EXEC_SQL.fetchHospitalGallery,
                sqlInsertGallery: EXEC_SQL.insertHospitalGallery,
                sqlDeleteGallery: EXEC_SQL.deleteHospitalGallery,
                information: [request.body.information, request.query.id],
                gallery: request.body.gallery,
                id: request.query.id
            })
            .then(HANDLER.beginTransaction)
            .then(HANDLER.updateBasicInfo)
            .then(HANDLER.fetchGallery)
            .then(HANDLER.batchRemoveWrapper)
            .then(HANDLER.removeGallery)
            .then(HANDLER.batchCopyWrapper)
            .then(HANDLER.insertGallery)
            .then(HANDLER.commitTransaction)
            .then(HANDLER.deepClean)
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
                id: request.params.id,
                index: 0,
                sqlFetchGallery: EXEC_SQL.fetchHospitalGallery,
                execSQLs: [
                    EXEC_SQL.deleteRelativeDoctorsGallery,
                    EXEC_SQL.deleteRelativeDoctors,
                    EXEC_SQL.deleteRelativeDepartmentsGallery,
                    EXEC_SQL.deleteRelativeDepartments,
                    EXEC_SQL.deleteHospitalGallery,
                    EXEC_SQL.deleteHospital
                ],
                information: [request.params.id]
            })
            .then(HANDLER.beginTransaction)
            .then(HANDLER.fetchGallery)
            .then(HANDLER.batchRemoveWrapper)
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
     * 获取列表 - 医院
     * @param request
     * @param response
     */
    fetchHospitalList: function (request, response) {

        HANDLER
            .setUpConnection({
                execSQL: EXEC_SQL.fetchHospitalList,
                values: null
            })
            .then(HANDLER.fetchList)
            .then(HANDLER.cleanup)
            .then(function (result) {
                if (result.code === 0) {
                    response(result.msg);
                } else {
                    response([]);
                }
            })
            .catch(function (request) {
                HANDLER.onReject(request, response);
            });
    },

    /**
     * 获取指定医院
     * @param request
     * @param response
     */
    querySpecificHospital: function (request, response) {

        console.info("==>   querySpecificHospital");

        HANDLER
            .setUpConnection({
                hospital: {
                    sql: EXEC_SQL.querySpecificHospital,
                    values: request.params.id
                },
                gallery: {
                    sql: EXEC_SQL.fetchHospitalGallery,
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
