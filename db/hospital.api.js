//  导入MySQL模块
const MYSQL = require('mysql');
const CONFIG = require('./mysql.config');
const EXEC_SQL = require('./hospital.interface');
const CODE = {
    /**
     * 成功code
     */
    successCode: 0,
    /**
     * 失败code
     */
    failedCode: -100,
    /**
     * 数据库连接失败code
     */
    databaseErrorCode: -200
};


var api = {

    addHospital: function (req, res) {

    },

    editHospital: function (req, res) {

    },

    deleteHospital: function (req, res) {

    },

    fetchHospitalDetail: function (req, res) {

    },

    fetchAllDoctors: function (callback) {
        console.info("hospital.api.js ==> fetchAllDoctors");

        var
            // 使用mysql.config.js的配置信息创建一个MySQL连接池
            pool = MYSQL.createPool(CONFIG.mysql);

        // 从连接池获取连接
        pool.getConnection(function (err, connection) {
            console.info("hospital.api.js ==> getConnection ==> callback | Error: " + err);

            if (err) {
                // 回调
                callback({
                    code: CODE.databaseErrorCode,
                    msg: err
                });

            } else {
                // 建立连接 增加一个用户信息
                connection.query(EXEC_SQL.queryAll, function (err, result) {
                    var response;

                    if (err) {
                        console.info('hospital.api.js ==>  [QUERY ERROR] - ' + err.message);
                        response = {
                            code: CODE.failedCode,
                            msg: err
                        };
                    } else {
                        console.info('hospital.api.js ==> [QUERY SUCCESS] ');
                        response = {
                            code: CODE.successCode,
                            msg: result
                        };
                    }
                    callback(response);

                    // 释放连接
                    connection.release();
                });
            }

        });
    },

    addDepartment: function (req, res) {

    },

    editDepartment: function (req, res) {

    },

    deleteDepartment: function (req, res) {

    },

    fetchDepartmentList: function (req, res) {

    },

    addDoctor: function (req, res) {

    },

    editDoctor: function (req, res) {

    },

    deleteDoctor: function (req, res) {

    },

    fetchDoctorList: function (req, res) {

    }
};


module.exports = api;
