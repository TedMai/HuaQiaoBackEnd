const HANDLER = require('./mysql.handler');
const EXEC_SQL = require('./department.interface');

var api = {

    /**
     * 新增 - 科室
     * @param request
     * @param response
     */
    addDepartment: function (request, response) {

        HANDLER
            .setUpConnection({
                sqlBasicInfo: EXEC_SQL.addDepartment,
                sqlInsertGallery: EXEC_SQL.insertDepartmentGallery,
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
     * 编辑 - 科室
     * @param request
     * @param response
     */
    editDepartment: function (request, response) {

        HANDLER
            .setUpConnection({
                sqlUpdateInfo: EXEC_SQL.editDepartment,
                sqlFetchGallery: EXEC_SQL.fetchDepartmentGallery,
                sqlInsertGallery: EXEC_SQL.insertDepartmentGallery,
                sqlDeleteGallery: EXEC_SQL.deleteDepartmentGallery,
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
                HANDLER.onReject(request, response);
            });
    },

    /**
     * 删除 - 科室
     * @param request
     * @param response
     */
    deleteDepartment: function (request, response) {

        HANDLER
            .setUpConnection({
                id: request.params.id,
                index: 0,
                sqlFetchGallery: EXEC_SQL.fetchDepartmentGallery,
                execSQLs: [
                    EXEC_SQL.deleteRelativeDoctorsGallery,
                    EXEC_SQL.deleteRelativeDoctors,
                    EXEC_SQL.deleteDepartmentGallery,
                    EXEC_SQL.deleteDepartment
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
     * 获取列表 - 科室
     * @param request
     * @param response
     */
    fetchDepartmentList: function (request, response) {

        HANDLER
            .setUpConnection({
                department: {
                    sql: EXEC_SQL.fetchSpecificDepartment,
                    values: request.params.id
                },
                gallery: {
                    sql: EXEC_SQL.fetchDepartmentGallery,
                    values: request.params.id
                },
                doctors: {
                    sql: EXEC_SQL.fetchRelativeDoctors,
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