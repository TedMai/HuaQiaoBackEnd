//  导入MySQL模块
const MYSQL = require('mysql');
const CONFIG = require('./mysql.config');
const EXEC_SQL = require('./hospital.interface');
const CODE = {
    /**
     * 成功code
     */
    successCode : 0,
    /**
     * 失败code
     */
    failedCode  : -100,
    /**
     * 数据库连接失败code
     */
    databaseErrorCode: -200
};


var api = {

    fetchAllDoctors: function (callback) {
        console.info("hospital.api.js ==> dbAllDoctors");

        var
            that = this,
            // 使用mysql.config.js的配置信息创建一个MySQL连接池
            pool = MYSQL.createPool(CONFIG.mysql);

        // 从连接池获取连接
        pool.getConnection(function (err, connection) {
            console.info("hospital.api.js ==> getConnection ==> callback | Error: " + err);

            if (err) {
                that.response = {
                    code: CODE.databaseErrorCode,
                    msg: err
                };
                // 回调
                callback(that.response);

            } else {
                // 建立连接 增加一个用户信息
                connection.query(EXEC_SQL.queryAll, function (err, result) {
                    if (err) {
                        console.info('hospital.api.js ==>  [QUERY ERROR] - ' + err.message);
                        that.response = {
                            code: CODE.failedCode,
                            msg: err
                        };
                    } else {
                        console.info('hospital.api.js ==> [QUERY SUCCESS] ');
                        that.response = {
                            code: CODE.successCode,
                            msg: result
                        };
                    }
                    callback(that.response);

                    // 释放连接
                    connection.release();
                });
            }

        });
    }
};


module.exports = api;
