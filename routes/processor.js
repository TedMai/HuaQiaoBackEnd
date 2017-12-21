const Q = require('q');
const express = require('express');
const router = express.Router();
const path = require('path');
const multipart = require('connect-multiparty');
const fileSystem = require("../services/file.system.service");
const FORMAT = require('../db/utility.date');
const gallery = require('../db/gallery.api');
const __DEPARTMENT__ = require('../db/department.api');
const __SCHEDULE__ = require('../db/schedule.api');
const __MAX_UPLOAD_FILE_NUM__ = 9;

/**
 *  上传图片文件（单个或多个）至temp文件夹
 *
 */
router.post('/image', multipart(), function (req, res, next) {
    var i,
        length,
        promises = [];

    console.info("==>   processor.js | POST /image");
    console.info(req.files);

    if (typeof(req.files) === "undefined" || !req.files.hasOwnProperty('file')) {
        res.json({
            code: -400,
            msg: "Empty. File not found."
        });
        return;
    }

    /**
     * 判断传入参数是否为数组类型
     * -- instanceof Array
     */
    if (typeof(req.files['file']) === "object") {
        if (req.files['file'] instanceof Array) {
            // 一次性最多上传图片数
            if (req.files['file'].length > __MAX_UPLOAD_FILE_NUM__) {
                res.json({
                    code: 400,
                    msg: "Upload " + __MAX_UPLOAD_FILE_NUM__ + " copies at mose."
                });
                return;
            }
            // 异步同时上传文件
            for (i = 0, length = req.files['file'].length; i < length; i++) {
                promises.push(fileSystem.uploadOneFile(req.files['file'][i]));
            }

            Q.all(promises)
                .then(
                    function (result) {
                        var i = 0,
                            paths = [];

                        console.info("==>  Q.all  ==>  callback ==> success");
                        result.forEach(function (element) {
                            paths[i++] = element.path;
                        });

                        res.json({
                            code: 0,
                            msg: "Success",
                            paths: paths
                        });
                    },
                    function (error) {
                        console.info("==>  Q.all  ==>  callback ==> fail");
                        res.json(error);
                    }
                )
        } else {
            fileSystem.uploadOneFile(req.files['file'])
                .then(
                    function (result) {
                        console.info("uploadOneFile  ==>  callback ==> success");
                        res.json({
                            code: 0,
                            msg: "Success",
                            paths: [result.path]
                        });
                    },
                    function (error) {
                        console.info("uploadOneFile  ==>  callback ==> fail");
                        res.json(error)
                    }
                );
        }
    }
});

router.post('/excel/:object', multipart(), function (req, res, next) {
    console.info("==>   processor.js | POST /excel");
    console.info(req.params);
    console.info(req.files);

    if (typeof(req.files) === "undefined" || !req.files.hasOwnProperty('file')) {
        res.json({
            code: -400,
            msg: "Empty. File not found."
        });
        return;
    }

    fileSystem
        .excelReader(req.files['file'])
        .then(
            function (request) {
                console.info("excelReader  ==>  callback ==> success");
                // console.info(request.data);
                if (request.data instanceof Array && request.data.length > 1) {
                    // 第一行为字段名 - 弹出
                    request.data.shift();
                    switch (req.params["object"]) {
                        case 'department':
                            __DEPARTMENT__.batchInsertDepartment(request.data, function (request) {
                                res.json(request);
                            });
                            break;
                        case 'schedule':
                            // for (var i = 0, length = request.data.length; i < length; i++) {
                            //     console.info(request.data[i]);
                            //     console.info(request.data[i][1]);
                            //     Date.prototype.format = FORMAT.format;
                            //     console.info(new Date().format("yyyy-MM-dd"));
                            // }

                            // __SCHEDULE__.batchInsertSchedule(request.data, function (request) {
                            //     res.json(request);
                            // });
                            break;
                        default:
                            res.send("Parameter - " + that.tableName + " not found.");
                            break;
                    }
                } else {
                    res.json({
                        code: -400,
                        msg: "Bad format!!"
                    });
                }

            },
            function (error) {
                console.info("excelReader  ==>  callback ==> fail");
                res.json(error);
            }
        );
});

/**
 * 拷贝至temp文件夹
 */
router.get("/temp/:type/:id", function (req, res, next) {
    /**
     * 请求参数
     *  -   对象类型
     *  -   对象ID
     */
    console.info(req.params);
    /**
     * 根据ID及类型获取对象图集
     */
    gallery.fetchGallery(req, function (request) {
        console.info(request);
        fileSystem
            .batchCopy(request.msg, "screenshot", "temp")
            .then(
                function (result) {
                    res.json(result);
                },
                function (err) {
                    res.json(err);
                }
            );
    });
});

/**
 * 删除图片
 */
router.post("/remove/:root/:path", function (req, res, next) {

    console.info(" ==>   process.js ==>     remove image.");
    console.info(req.params);

    fileSystem
        .remove(path.join(req.params.root, req.params.path))
        .then(
            function (response) {
                res.json(response);
            },
            function (err) {
                res.json(err);
            }
        )
        .catch(function (ex) {
            res.json(ex);
        });

});

module.exports = router;
