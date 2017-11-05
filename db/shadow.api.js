const HANDLER = require('./mysql.handler');
const EXEC_SQL = require('./shadow.interface');

var api = {
    initialization: function (request, response) {

        HANDLER
            .setUpConnection({
                hospital: EXEC_SQL.fetchHospitalList,
                department: EXEC_SQL.fetchDepartmentList,
                doctor: EXEC_SQL.fetchDoctorList
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