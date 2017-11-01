const Q = require('q');
const MYSQL = require('mysql');
const CODE = require('./mysql.code');
const CONFIG = require('./mysql.config');

module.exports =
    {
        // 使用mysql.config.js的配置信息创建一个MySQL连接池
        pool: MYSQL.createPool(CONFIG.mysql),

        /**
         * 建立连接
         * @param parameters
         * @returns {*|Promise|promise}
         */
        setUpConnection: function (parameters) {
            var deferred = Q.defer();
            // 从连接池获取连接
            this.pool.getConnection(function (err, connection) {
                console.info("==> setUpConnection ==> callback | " + err);
                if (err) {
                    deferred.reject({
                        connection: connection,
                        code: CODE.databaseErrorCode,
                        errMsg: err
                    });
                }
                deferred.resolve({
                    connection: connection,
                    params: parameters
                });
            });
            return deferred.promise;
        },

        /**
         * 启动事务
         * @param request
         * @returns {*|Promise|promise}
         */
        beginTransaction: function (request) {
            var deferred = Q.defer();
            // 启动事务
            request.connection.beginTransaction(function (err) {
                console.info("==> beginTransaction ==> callback |  " + err);
                if (err) {
                    deferred.reject({
                        connection: request.connection,
                        code: CODE.failedCode,
                        errMsg: err
                    });
                }
                deferred.resolve(request);
            });

            return deferred.promise;
        },

        /**
         * 提交事务
         * @param request
         * @returns {*|Promise|promise}
         */
        commitTransaction: function (request) {
            var deferred = Q.defer();

            request.connection.commit(function (err) {
                console.info("==> commitTransaction ==> callback |  " + err);
                if (err) {
                    deferred.reject({
                        connection: request.connection,
                        code: CODE.failedCode,
                        errMsg: err
                    });
                }
                deferred.resolve(request);
            });

            return deferred.promise;
        },

        /**
         * 添加 - 基本信息
         * @param request
         * @returns {*|Promise|promise}
         */
        setBasicInfo: function (request) {
            var deferred = Q.defer();

            request.connection.query(request.params.sqlBasicInfo, request.params.information, function (err, result) {
                console.info("==> setBasicInfo ==> callback |  " + err);
                if (err) {
                    deferred.reject({
                        connection: request.connection,
                        code: CODE.failedCode,
                        errMsg: err
                    });
                }
                deferred.resolve({
                    connection: request.connection,
                    params: request.params,
                    result: result
                });
            });

            return deferred.promise;
        },

        updateBasicInfo: function (request) {
            var deferred = Q.defer();

            request.connection.query(request.params.sqlUpdateInfo, request.params.information, function (err, result) {
                console.info("==> updateBasicInfo ==> callback |  " + err);
                if (err) {
                    deferred.reject({
                        connection: request.connection,
                        code: CODE.failedCode,
                        errMsg: err
                    });
                }
                deferred.resolve({
                    connection: request.connection,
                    params: request.params,
                    result: result
                });
            });

            return deferred.promise;
        },

        /**
         * 插入图片
         * @param request
         * @returns {*|Promise|promise}
         */
        insertGallery: function (request) {
            var deferred = Q.defer();

            request.params.gallery.relative = request.result.insertId;
            request.connection.query(request.params.sqlInsertGallery, request.params.gallery, function (err, result) {
                console.info("==> insertGallery ==> callback |  " + err);
                if (err) {
                    deferred.reject({
                        connection: request.connection,
                        code: CODE.failedCode,
                        errMsg: err
                    });
                }
                deferred.resolve({
                    connection: request.connection,
                    result: result
                });
            });

            return deferred.promise;
        },

        /**
         * 获取列表
         * @param request
         * @returns {*|Promise|promise}
         */
        fetchList: function (request) {
            var deferred = Q.defer();

            console.info("==>   fetchList");
            request.connection.query(request.params.execSQL, request.params.values, function (err, result) {
                if (err) {
                    deferred.reject({
                        connection: request.connection,
                        code: CODE.failedCode,
                        errMsg: err
                    });
                }
                deferred.resolve({
                    connection: request.connection,
                    result: result
                });
            });

            return deferred.promise;
        },

        /**
         * 扫尾 - 释放连接
         * @param request
         * @returns {*|Promise|promise}
         */
        cleanup: function (request) {
            var deferred = Q.defer();

            console.info("==>   cleanup");
            request.connection.release();
            deferred.resolve({
                code: CODE.successCode,
                msg: request.result
            });

            return deferred.promise;
        },

        /**
         * 错误处理
         * @param request
         * @param response
         */
        onReject: function (request, response) {
            console.info("==>   onReject");
            if (request.code === CODE.failedCode) {
                request.connection.release();
            }
            response({
                code: request.code,
                msg: request.errMsg
            });
        },

        /**
         * 错误处理 - 带回滚
         * @param request
         * @param response
         */
        onRejectWithRollback: function (request, response) {
            console.info("==>   onRejectWithRollback");
            if (request.code === CODE.failedCode) {
                request.connection.rollback(function () {
                    console.info("==>   onRejectWithRollback    ==>     rollback");
                    request.connection.release();
                });
            }
            response({
                code: request.code,
                msg: request.errMsg
            });
        }
    };