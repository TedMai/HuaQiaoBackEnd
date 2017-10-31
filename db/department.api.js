//  导入MySQL模块
const MYSQL = require('mysql');
const CONFIG = require('./mysql.config');
const CODE = require('./mysql.code');
const HANDLER = require('./mysql.handler');
const EXEC_SQL = require('./department.interface');

var api = {
// 使用mysql.config.js的配置信息创建一个MySQL连接池
    pool: MYSQL.createPool(CONFIG.mysql),

    addDepartment: function (req, callback) {
        // 从连接池获取连接
        this.pool.getConnection(function (err, connection) {
            console.info("department.api.js ==> addDepartment ==> callback | Error: " + err);

            if (err) {
                // 回调
                callback({
                    code: CODE.databaseErrorCode,
                    msg: err
                });

            } else {    // 建立连接
                var department = {
                    name: "内科",
                    description: "莆田华侨医院内科是集临床、保健、康复、教学和科研为一体的临床重点科室。现有副主任医师3人，主治医师2人，主管护师 1 人。科室设有床位33张，每个房间按A类病房标准配置, 有独立卫生间、洗漱设施、热水、空调、电视等设施。科室拥有进口电子胃镜、心电监护仪、微量推注泵、输液泵、心电图机、快速血糖测量仪等先进设备。能开展神经、消化、心血管、内分泌、呼吸、血液、肾脏、风湿、中毒等专科疾病的诊治，以消化、内分泌、心脑血管作为龙头带动其他专业发展。",
                    parent: 0,
                    hospital: 3
                };

                connection.query(EXEC_SQL.addDepartment, department, function (err, result) {
                    var gallery;

                    if (err) {
                        connection.rollback(function () {
                            // 回调
                            callback({
                                code: CODE.databaseErrorCode,
                                msg: err
                            });
                        });
                    } else {
                        gallery = {
                            imageurl: "20170929/201709290911094643.jpeg",
                            type: 1,
                            relative: result.insertId
                        };
                        connection.query(EXEC_SQL.insertDepartmentGallery, gallery, function (err, result) {
                            if (err) {
                                connection.rollback(function () {
                                    // 回调
                                    callback({
                                        code: CODE.databaseErrorCode,
                                        msg: err
                                    });
                                });
                            } else {
                                connection.commit(function (err) {
                                    if(err) {
                                        connection.rollback(function () {
                                            // 回调
                                            callback({
                                                code: CODE.failedCode,
                                                msg: err
                                            });
                                        });
                                    } else {
                                        // 回调
                                        callback({
                                            code: CODE.successCode,
                                            msg: "add new department completed."
                                        });
                                    }
                                }); /** end of connection. **/
                            }
                        }); /** end of insertHospitalGallery. **/
                    }
                }); /** end of addHospital. **/
            }
        }); /** end of getConnection. **/
    },

    editDepartment: function (req, res) {

    },

    deleteDepartment: function (req, res) {

    },

    fetchDepartmentList: function (callback) {
        console.info("hospital.api.js ==> fetchDepartmentList");
        HANDLER.execute(EXEC_SQL.fetchDepartmentList, null, callback);
    }
};

module.exports = api;