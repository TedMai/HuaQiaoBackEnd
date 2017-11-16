const Q = require('q');
const fs = require('fs');
const path = require('path');
const express = require('express');
const router = express.Router();
const multipart = require('connect-multiparty');
const formatter = require('../db/utility.date');
const __MAX_UPLOAD_FILE_SIZE__ = 3 * 1024 * 1024;
const __MAX_UPLOAD_FILE_NUM__ = 9;

function uploadOneFile(upload) {
    var tmpFilePath,
        fileName,
        rootPath,
        folderName,
        folderPath,
        source,
        destination,
        deferred = Q.defer();

    /**
     * 检查上传文件的格式
     */
    if (upload['type'] !== 'image/jpeg' &&
        upload['type'] !== 'image/jpg' &&
        upload['type'] !== 'image/png') {
        deferred.reject(
            {
                code: 400,
                msg: "Incorrect file format."
            }
        );
        return deferred.promise;
    }

    /**
     * 检查上传文件的大上
     * 不能超过5MB
     */
    if (upload['size'] > __MAX_UPLOAD_FILE_SIZE__) {
        deferred.reject(
            {
                code: 400,
                msg: "File is too large to upload."
            }
        );
        return deferred.promise;
    }

    try {
        /**
         * 文件上传的保存目录
         * 以当前程序的执行目录为起点，向上一级目录，找到screenshot
         * 按照当前日期生成子目录
         * @type {string}
         */
        Date.prototype.format = formatter.format;
        folderName = new Date().format('yyyyMMdd');
        rootPath = path.resolve(process.cwd(), "..") + path.sep + "screenshot";
        // 如果根目录不存在，则创建
        if (!fs.existsSync(rootPath)) {
            fs.mkdirSync(rootPath);
        }
        folderPath = rootPath + path.sep + folderName;
        // 如果子目录不存在，则创建
        if (!fs.existsSync(folderPath)) {
            fs.mkdirSync(folderPath);
        }

        /**
         * 将文件从临时文件夹复制至目标文件夹
         */
        tmpFilePath = upload['path'];
        fileName = new Date().format('yyyyMMddhhmmssS') + Math.round(Math.random() * 1000) + "_" + upload['name'];
        source = fs.createReadStream(tmpFilePath);
        destination = fs.createWriteStream(folderPath + path.sep + fileName);
        source.pipe(destination);

        /**
         * 完成后删除临时文件
         */
        source.on('end', function () {
            console.info("-- END -- | delete temp file");
            fs.unlinkSync(tmpFilePath);
            deferred.resolve(
                {
                    code: 0,
                    msg: "Success",
                    path: folderName + path.sep + fileName
                }
            );
        });   //delete

        source.on('error', function (err) {
            console.info(err);
            deferred.reject(
                {
                    code: 400,
                    msg: err
                }
            );
        });
    } catch (exception) {
        deferred.reject(
            {
                code: 400,
                msg: exception
            }
        );
    }

    return deferred.promise;
}

router.post('/', multipart(), function (req, res, next) {
    var i,
        length,
        promises = [];

    console.info("==>   processor   | POST");
    console.info(req.files);

    if (typeof(req.files) === "undefined" || !req.files.hasOwnProperty('file')) {
        res.json({
            code: 400,
            msg: "Empty. File not found."
        });
        return;
    }

    if (typeof(req.files['file']) === "object") {
        if (req.files['file'] instanceof Array) {
            if (req.files['file'].length > __MAX_UPLOAD_FILE_NUM__) {
                res.json({
                    code: 400,
                    msg: "Upload " + __MAX_UPLOAD_FILE_NUM__ + " copies at mose."
                });
                return;
            }

            for (i = 0, length = req.files['file'].length; i < length; i++) {
                promises.push(uploadOneFile(req.files['file'][i]));
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
            uploadOneFile(req.files['file'], res)
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

module.exports = router;
