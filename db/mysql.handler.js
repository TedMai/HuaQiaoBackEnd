const MYSQL = require('mysql');
const CONFIG = require('./mysql.config');
const CODE = require('./mysql.code');

module.exports =
    {
        // 使用mysql.config.js的配置信息创建一个MySQL连接池
        pool: MYSQL.createPool(CONFIG.mysql),

        execute: function (execSQL, values, callback) {
            // 从连接池获取连接
            this.pool.getConnection(function (err, connection) {
                console.info("mysql.handler.js ==> getConnection ==> callback | Error: " + err);

                if (err) {
                    // 回调
                    callback({
                        code: CODE.databaseErrorCode,
                        msg: err
                    });

                } else {
                    // 建立连接
                    connection.query(execSQL, values, function (err, result) {
                        var response;

                        if (err) {
                            console.info('mysql.handler.js ==> connection.query =>  [SQL ERROR] - ' + err.message);
                            response = {
                                code: CODE.failedCode,
                                msg: err
                            };
                        } else {
                            console.info('mysql.handler.js ==> connection.query =>  [SQL SUCCESS] ');
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
                /** end of if  **/
            });
        }
    };