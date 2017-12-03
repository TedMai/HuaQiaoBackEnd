const Q = require('q');
const MYSQL = require('mysql');
const CODE = require('./mysql.code');
const CONFIG = require('./mysql.config');
const FORMAT = require('./utility.date');
const FILESYSTEM = require('../routes/fileSystem');

var handler =
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

        /**
         * 编辑 - 基本信息
         * @param request
         * @returns {*|Promise|promise}
         */
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
         * 删除 - 基本信息
         * @param request
         * @returns {*|Promise|promise}
         */
        deleteBasicInfo: function (request) {
            var deferred = Q.defer();

            request.connection.query(request.params.sqlDeleteInfo, request.params.information, function (err, result) {
                console.info("==> deleteBasicInfo ==> callback |  " + err);
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

        oneStepDelete: function (request) {
            var deferred = Q.defer();

            request.connection.query(request.params.execSQLs[request.params.index], request.params.information, function (err, result) {
                console.info("==> oneStepDelete ==> callback |  " + err);
                if (err) {
                    deferred.reject({
                        connection: request.connection,
                        code: CODE.failedCode,
                        errMsg: err
                    });
                }

                request.params.index = request.params.index + 1;
                request.result = result;
                deferred.resolve(request);
            });

            return deferred.promise;
        },

        /**
         * 删除数据集
         * 实现串行操作
         * @param request
         * @returns {Promise|*|promise}
         */
        deleteDataSet: function (request) {
            var i,
                length,
                promise,
                tasks = [];

            for (i = 0, length = request.params.execSQLs.length; i < length; i++) {
                tasks.push(handler.oneStepDelete);
            }

            promise = Q(request);

            for (i = 0, length = tasks.length; i < length; i++) {
                promise = promise.then(tasks[i]);
            }

            return promise;
        },

        /**
         * 批量删除图片文件
         *  --  封装
         * @param request
         * @returns {*|promise|Promise}
         */
        batchCopyWrapper: function (request) {
            var
                deferred = Q.defer();

            console.info("==>   batchCopyWrapper");
            console.info(request.params.gallery);
            /**
             * 未找到上传图集 直接跳过
             */
            if (!request.params.gallery instanceof Array) {
                deferred.resolve({
                    connection: request.connection,
                    params: request.params,
                    insertId: request.result.insertId
                });
            } else if (request.params.gallery.length === 0) {
                deferred.resolve({
                    connection: request.connection,
                    params: request.params,
                    insertId: request.result.insertId
                });
            } else {

                FILESYSTEM
                    .batchCopy(request.params.gallery, "temp", "screenshot")
                    .then(
                        function (result) {
                            deferred.resolve({
                                connection: request.connection,
                                params: request.params,
                                insertId: request.result.insertId
                            });
                        },
                        function (err) {
                            deferred.reject({
                                connection: request.connection,
                                code: CODE.failedCode,
                                errMsg: err.msg
                            });
                        }
                    );
            }

            return deferred.promise;
        },

        batchRemoveWrapper: function (request) {
            var
                deferred = Q.defer();

            console.info("==>   batchRemoveWrapper");
            console.info(request.result);

            if (request.result.length === 0) {
                deferred.resolve({
                    connection: request.connection,
                    params: request.params
                });
            } else {

                FILESYSTEM
                    .batchRemove(request.result, "screenshot")
                    .then(
                        function (result) {
                            deferred.resolve({
                                connection: request.connection,
                                params: request.params
                            });
                        },
                        function (err) {
                            deferred.reject({
                                connection: request.connection,
                                code: CODE.failedCode,
                                errMsg: err.msg
                            });
                        }
                    );
            }

            return deferred.promise;
        },

        /**
         * 数据库操作 - 插入图集
         * @param request
         * @returns {*|Promise|promise}
         */
        insertGallery: function (request) {
            var i,
                length,
                values = [],
                deferred = Q.defer();

            console.info("==>   insertGallery");
            console.info(request.params.gallery);
            /**
             * 未找到上传图集 直接跳过
             */
            if (!request.params.gallery instanceof Array) {
                deferred.resolve({
                    connection: request.connection,
                    params: request.params,
                    result: "DONE"
                });
            } else if (request.params.gallery.length === 0) {
                deferred.resolve({
                    connection: request.connection,
                    params: request.params,
                    result: "DONE"
                });
            }
            else {
                for (i = 0, length = request.params.gallery.length; i < length; i++) {
                    values[i] = [
                        request.params.gallery[i].imageurl,
                        request.params.gallery[i].type,
                        request.insertId
                    ]
                    // request.params.gallery[i].relative = request.result.insertId;
                }
                console.info(values);

                request.connection.query(request.params.sqlInsertGallery, [values], function (err, result) {
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
                        params: request.params,
                        result: result
                    });
                });
            }

            return deferred.promise;
        },

        /**
         * 数据库操作 - 删除图集
         * @param request
         * @returns {*|promise|Promise}
         */
        removeGallery: function (request) {
            var
                values = [request.params.id],
                deferred = Q.defer();

            console.info("==>   removeGallery");
            request.connection.query(request.params.sqlDeleteGallery, [values], function (err, result) {
                console.info("==> removeGallery ==> callback |  " + err);
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
                    result: {
                        insertId: request.params.id
                    }
                });
            });

            return deferred.promise;
        },

        fetchGallery: function (request) {
            var
                values = [request.params.id],
                deferred = Q.defer();

            console.info("==>   fetchGallery");
            request.connection.query(request.params.sqlFetchGallery, [values], function (err, result) {
                console.info("==> fetchGallery ==> callback |  " + err);
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
                    tableName: request.params.tableName,
                    result: result
                });
            });

            return deferred.promise;
        }
        ,

        /**
         * 获取所有数据
         * 实现并行操作
         * @param request
         * @returns {*|Promise|promise}
         */
        fetchDataSet: function (request) {
            var item,
                value,
                promises = [],
                deferred = Q.defer();

            console.info("==>   fetchDataSet");
            for (item in request.params) {
                value = {
                    connection: request.connection,
                    params: {
                        tableName: item,
                        execSQL: request.params[item].sql,
                        values: request.params[item].values
                    }
                };

                promises.push(handler.fetchList(value));
            }

            Q.all(promises)
                .then(
                    function (result) {
                        var final = {};

                        console.info("==>  Q.all  ==>  callback");
                        result.forEach(function (element) {
                            final[element.tableName] = JSON.stringify(element.result);
                        });

                        deferred.resolve({
                            connection: request.connection,
                            result: final
                        });
                    },
                    function (error) {
                        deferred.reject(error);
                    }
                );

            return deferred.promise;
        }
        ,

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

        deepClean: function (request) {
            var deferred = Q.defer();

            console.info("==>   deepClean");
            request.connection.release();
            if (request.params.hasOwnProperty("gallery") && request.params.gallery.length > 0) {
                FILESYSTEM
                    .batchRemove(request.params.gallery, "temp")
                    .then(
                        function (result) {
                            deferred.resolve({
                                code: CODE.successCode,
                                msg: result.msg
                            });
                        },
                        function (err) {
                            deferred.reject({
                                code: CODE.failedCode,
                                msg: err.msg
                            });
                        }
                    );
            } else {
                deferred.resolve({
                    code: CODE.successCode,
                    msg: request.result
                });
            }

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
        }
        ,

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
        ,

        /**
         * 转化时间格式
         * 将 iso-8601 datetime 转换成 MySQL 可识别的 datetime
         * @param request
         * @returns {Promise|*|promise}
         */
        transformRequest: function (request) {
            var deferred = Q.defer();

            console.info("==>   transformRequest");
            Date.prototype.format = FORMAT.format;
            request.body.information.founding = new Date(request.body.information.founding).format("yyyy-MM-dd");
            console.info(request.body.information);

            deferred.resolve(request);

            return deferred.promise;
        }
        ,

        transformResponse: function (request) {
            var i,
                length,
                deferred = Q.defer();

            console.info("==>   transformResponse");
            for (i = 0, length = request.result.length; i < length; i++) {
                console.info(request.result[i]);
                if (request.result[i].hasOwnProperty("founding")) {
                    Date.prototype.format = FORMAT.format;
                    request.result[i].founding = new Date(request.result[i].founding).format("yyyy-MM-dd");
                    console.info(request.result[i].founding);
                }
            }

            deferred.resolve({
                connection: request.connection,
                result: request.result
            });

            return deferred.promise;
        }
    }
;

module.exports = handler;