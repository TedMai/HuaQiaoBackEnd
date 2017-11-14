const HANDLER = require('./mysql.handler');
const EXEC_SQL = require('./doctor.interface');

var api = {

    /**
     * 新增 - 医生
     * @param request
     * @param response
     */
    addDoctor: function (request, response) {

        HANDLER
            .setUpConnection({
                sqlBasicInfo: EXEC_SQL.addDoctor,
                sqlInsertGallery: EXEC_SQL.insertDoctorGallery,
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
     * 编辑 - 医生
     * @param request
     * @param response
     */
    editDoctor: function (request, response) {
        HANDLER
            .setUpConnection({
                sqlUpdateInfo: EXEC_SQL.editDoctor,
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

    deleteDoctor: function (request, response) {

        HANDLER
            .setUpConnection({
                sqlDeleteInfo: EXEC_SQL.deleteDoctor,
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

    fetchDoctorList: function (response) {

        HANDLER
            .setUpConnection({
                tableName: 'doctor',
                execSQL: EXEC_SQL.fetchDoctorList,
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