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
     * 编辑 - 科室
     * @param request
     * @param response
     */
    editDepartment: function (request, response) {

        HANDLER
            .setUpConnection({
                sqlUpdateInfo: EXEC_SQL.editDepartment,
                information: [request.body.information, request.query.id]
            })
            .then(HANDLER.updateBasicInfo)
            .then(HANDLER.cleanup)
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
                sqlDeleteInfo: EXEC_SQL.deleteDepartment,
                information: [request.params.id]
            })
            .then(HANDLER.deleteBasicInfo)
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
     * @param response
     */
    fetchDepartmentList: function (response) {

        HANDLER
            .setUpConnection({
                tableName: 'department',
                execSQL: EXEC_SQL.fetchDepartmentList,
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