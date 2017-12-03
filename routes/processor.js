const Q = require('q');
const express = require('express');
const router = express.Router();
const path = require('path');
const multipart = require('connect-multiparty');
const fileSystem = require("./fileSystem");
const gallery = require('../db/gallery.api');
const __MAX_UPLOAD_FILE_NUM__ = 9;

/**
 *  上传文件（单个或多个）至temp文件夹
 *
 */
router.post('/', multipart(), function (req, res, next) {
    var i,
        length,
        promises = [];

    console.info("==>   processor   | POST");
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
            fileSystem.uploadOneFile(req.files['file'], res)
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
 * 图片预览
 */
router.get('/image/:root/:path/:file', function (req, res, next) {
    var result;

    console.info(" ==>   process.js");
    console.info(req.params);

    try {
        result = fileSystem.paint(req.params.root, req.params.path, req.params.file);
        if (result.code === 0) {
            // setHeader(name, value) -  指定一个 HTTP 请求的头部
            // name 参数是要设置的头部的名称。这个参数不应该包括空白、冒号或换行。
            // value 参数是头部的值。这个参数不应该包括换行。
            res.setHeader("Content-Type", result.info.mimeType);
            res.writeHead(200, "Ok");
            res.write(result.content, "binary");            //格式必须为 binary，否则会出错
            res.end();
        } else {
            next(new Error(result.msg));
        }
    } catch (err) {
        next(new Error(err));
    }
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
