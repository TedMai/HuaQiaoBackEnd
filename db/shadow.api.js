const EXEC_SQL = require('./shadow.interface');
const HANDLER = require('./mysql.handler');
const HOSPITAL = require('./hospital.api');
const DEPARTMENT = require('./department.api');
const DOCTOR = require('./doctor.api');
const SCHEDULE = require('./schedule.api');
const APPOINTMENT = require('./appointment.api');
const PATIENT = require('./patient.api');
const USER = require('./user.api');
const CODE = require('./mysql.code');
const MESSAGE = require('./sms.api');
const __CRYPTO__ = require('crypto');

var api = {
    wechatServerConfig: function (request, response) {
        var echostr, nonce, signature, timestamp;
        var currSign, tmp;
        const token = 'rf11dpshMx3vi2qLND1t';

        signature = request.query.signature;
        timestamp = request.query.timestamp;
        nonce = request.query.nonce;
        echostr = request.query.echostr;

        tmp = [token, timestamp, nonce].sort().join("");
        currSign = __CRYPTO__.createHash("sha1").update(tmp).digest("hex");
        if (currSign === signature) {
            return response(echostr);
        } else {
            return response('FAILED');
        }
    },

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
            case 'schedule':
                SCHEDULE.addSchedule(request, response);
                break;
            case 'appointment':
                this.checkSmsValidity(request, response, APPOINTMENT.addAppointment);
                break;
            case 'patient':
                PATIENT.addPatient(request, response);
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
            case 'schedule':
                SCHEDULE.editSchedule(request, response);
                break;
            case 'appointment':
                APPOINTMENT.editAppointment(request, response);
                break;
            case 'patient':
                PATIENT.editPatient(request, response);
                break;
            case 'user':
                this.checkSmsValidity(request, response, USER.editUser);
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
            case 'schedule':
                SCHEDULE.deleteSchedule(request, response);
                break;
            case 'appointment':
                APPOINTMENT.deleteAppointment(request, response);
                break;
            case 'patient':
                PATIENT.deletePatient(request, response);
                break;
            case 'user':
                USER.deleteUser(request, response);
                break;
            default:
                response({
                    code: CODE.failedCode,
                    msg: "Parameter - " + request.params.name + " not found."
                });
                break;
        }
    },

    search: function (request, response) {

        switch (request.params.name) {
            case 'hospital':
                // HOSPITAL.searchHosptials(request, response);
                break;
            case 'department':
                DEPARTMENT.searchDepartments(request, response);
                break;
            case 'doctor':
                // DOCTOR.searchDoctors(request, response);
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
                HOSPITAL.querySpecificHospital(request, response);
                break;
            case 'department':
                DEPARTMENT.querySpecificDepartment(request, response);
                break;
            case 'doctor':
                DOCTOR.querySpecificDoctor(request, response);
                break;
            case 'appointment':
                APPOINTMENT.querySpecificAppointment(request, response);
                break;
            case 'patient':
                PATIENT.querySpecificPatient(request, response);
                break;
            case 'user':
                USER.querySpecificUser(request, response);
                break;
            default:
                response({
                    code: CODE.failedCode,
                    msg: "Parameter - " + request.params.name + " not found."
                });
                break;
        }
    },

    relatives: function (request, response) {

        switch (request.params.name) {
            case 'hospital':
                // HOSPITAL.querySpecificHospital(request, response);
                break;
            case 'department':
                // DEPARTMENT.querySpecificDepartment(request, response);
                break;
            case 'doctor':
                DOCTOR.queryRelativeDoctors(request, response);
                break;
            case 'schedule':
                SCHEDULE.queryRelativeSchedule(request, response);
                break;
            case 'patient':
                PATIENT.queryRelativePatients(request, response);
                break;
            case 'appointment':
                APPOINTMENT.queryRelativeAppointments(request, response);
                break;
            default:
                response({
                    code: CODE.failedCode,
                    msg: "Parameter - " + request.params.name + " not found."
                });
                break;
        }
    },

    fetch: function (request, response) {

        switch (request.params.name) {
            case 'hospital':
                HOSPITAL.fetchHospitalList(request, response);
                break;
            case 'department':
                DEPARTMENT.fetchDepartmentList(request, response);
                break;
            case 'doctor':
                DOCTOR.fetchDoctorList(request, response);
                break;
            case 'schedule':
                // SCHEDULE.queryRelativeSchedule(request, response);
                break;
            default:
                response({
                    code: CODE.failedCode,
                    msg: "Parameter - " + request.params.name + " not found."
                });
                break;
        }
    },

    login: function (request, response) {

        switch (request.params.type) {
            case 'union':
                if (request.params.action === 'unionLogin') {
                    USER.login(request, response);
                }
                else if (request.params.action === 'register') {
                    this.checkSmsValidity(request, response, USER.addUser);
                }
                else {
                    response({
                        code: CODE.failedCode,
                        msg: "Parameter action: - " + request.params.action + " not found."
                    });
                }
                break;
            case 'wechat':
                if (request.params.action === 'weChatLogin') {
                    USER.weChatLogin(request, response);
                }
                else {
                    response({
                        code: CODE.failedCode,
                        msg: "Parameter action: - " + request.params.action + " not found."
                    });
                }
                break;
            default:
                response({
                    code: CODE.failedCode,
                    msg: "Parameter type: - " + request.params.type + " not found."
                });
                break;
        }
    },

    /**
     * 验证手机有效性
     *  --  传入参数
     *          requestId
     *          bizId
     *          phone
     *          code
     * @param request
     * @param response
     * @param callback
     */
    checkSmsValidity: function (request, response, callback) {
        // 添加验证
        // 传入参数：
        MESSAGE.checkSms(request, function (result) {
            if (result.code === 0) {
                callback(request, response);
            } else {
                response({
                    code: CODE.smsCheckErrorCode,
                    msg: "验证码输入有误！"
                });
            }
        });
    },

    selectSuperior: function (request, response) {

        switch (request.params.name) {
            case 'department':
                HANDLER
                    .setUpConnection({
                        execSQL: EXEC_SQL.extractHospitalSelect,
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
                break;
            case 'doctor':
                HANDLER
                    .setUpConnection({
                        execSQL: EXEC_SQL.extractDepartmentSelect,
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
                break;
            default:
                response({
                    code: CODE.failedCode,
                    msg: "Parameter - " + request.params.name + " not found."
                });
                break;
        }

    },

    selectSubordinate: function (request, response) {

        switch (request.params.name) {
            case 'doctor':
                HANDLER
                    .setUpConnection({
                        execSQL: EXEC_SQL.extractSubordinateDepartment,
                        values: [request.params.id]
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