const EXEC_SQL = require('./shadow.interface');
const HANDLER = require('./mysql.handler');
const HOSPITAL = require('./hospital.api');
const DEPARTMENT = require('./department.api');
const DOCTOR = require('./doctor.api');
const CODE = require('./mysql.code');

var api = {
    initialization: function (request, response) {

        HANDLER
            .setUpConnection({
                hospital: {
                    sql: EXEC_SQL.fetchHospitalList,
                    values: null
                },
                department: {
                    sql: EXEC_SQL.fetchDepartmentList,
                    values: null
                },
                doctor: {
                    sql: EXEC_SQL.fetchDoctorList,
                    values: null
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

    insert: function (request, response) {

        switch (request.params.name) {
            case 'hospital':
                HOSPITAL.addHospital(request, response);
                break;
            case 'department':
                DEPARTMENT.addDepartment(request, response);
                break;
            case 'doctor':
                DOCTOR.addDoctor(request, response);
                break;
            default:
                response({
                    code: CODE.failedCode,
                    msg: "Parameter - " + request.params.name + " not found."
                });
                break;
        }
    },

    update: function (request, response) {

        switch (request.params.name) {
            case 'hospital':
                HOSPITAL.editHospital(request, response);
                break;
            case 'department':
                DEPARTMENT.editDepartment(request, response);
                break;
            case 'doctor':
                DOCTOR.editDoctor(request, response);
                break;
            default:
                response({
                    code: CODE.failedCode,
                    msg: "Parameter - " + request.params.name + " not found."
                });
                break;
        }
    },

    delete: function (request, response) {

        switch (request.params.name) {
            case 'hospital':
                HOSPITAL.deleteHospital(request, response);
                break;
            case 'department':
                DEPARTMENT.deleteDepartment(request, response);
                break;
            case 'doctor':
                DOCTOR.deleteDoctor(request, response);
                break;
            default:
                response({
                    code: CODE.failedCode,
                    msg: "Parameter - " + request.params.name + " not found."
                });
                break;
        }
    },

    query: function (request, response) {

        switch (request.params.name) {
            case 'hospital':
                // HOSPITAL.deleteHospital(request, response);
                break;
            case 'department':
                // DEPARTMENT.deleteDepartment(request,response);
                break;
            case 'doctor':
                // DOCTOR.deleteDoctor(request,response);
                break;
            default:
                break;
        }
    },

    selectOptions: function (request, response) {

        switch (request.params.name) {
            case 'department':
                HANDLER
                    .setUpConnection({
                        execSQL: EXEC_SQL.extractHospitalSelect
                    })
                    .then(HANDLER.fetchList)
                    .then(HANDLER.cleanup)
                    .then(function (result) {
                        response(result);
                    })
                    .catch(function (request) {
                        HANDLER.onReject(request, response);
                    });
                break;
            case 'doctor':
                HANDLER
                    .setUpConnection({
                        execSQL: EXEC_SQL.extractDepartmentSelect
                    })
                    .then(HANDLER.fetchList)
                    .then(HANDLER.cleanup)
                    .then(function (result) {
                        response(result);
                    })
                    .catch(function (request) {
                        HANDLER.onReject(request, response);
                    });
                break;
            default:
                response({
                    code: CODE.failedCode,
                    msg: "Parameter - " + request.params.name + " not found."
                });
                break;
        }

    }

};

module.exports = api;