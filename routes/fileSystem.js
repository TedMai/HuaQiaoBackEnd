const Q = require('q');
const fs = require('fs');
const log4js = require("../services/log4js.service");
const PATH = require('path');
const FORMATTER = require('../db/utility.date');
const IMAGEINFO = require('imageinfo');
const XLSX = require('node-xlsx');
const LOGGER = log4js.getLogger("default");
const __MAX_UPLOAD_FILE_SIZE__ = 3 * 1024 * 1024;

/**
 * 检查目标文件夹是否存在
 * 不存在，则递归创建文件夹
 * @param filePath
 */
function check(filePath) {
    var subFilePath;

    if (filePath.lastIndexOf(PATH.sep) === -1) {

    } else {
        subFilePath = filePath.substr(0, filePath.lastIndexOf(PATH.sep));
        if (!fs.existsSync(subFilePath)) {
            check(subFilePath);
            fs.mkdirSync(subFilePath);
        }
    }
}

var api = {

    /**
     * 上传文件 - 图像
     * 一次一张
     * @param upload
     * @returns {*|Promise|promise}
     */
    uploadOneFile: function (upload) {
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
                    code: -400,
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
                    code: -400,
                    msg: "File is too large to upload."
                }
            );
            return deferred.promise;
        }

        try {
            /**
             * 文件上传的保存目录
             * 以当前程序的执行目录为起点，向上一级目录，找到temp文件夹
             * 按照当前日期生成子目录
             * @type {string}
             */
            Date.prototype.format = FORMATTER.format;
            folderName = new Date().format('yyyyMMdd');
            rootPath = PATH.join(PATH.resolve(__dirname, '..', '..'), "temp");
            // 如果根目录不存在，则创建
            if (!fs.existsSync(rootPath)) {
                fs.mkdirSync(rootPath);
            }
            folderPath = PATH.join(rootPath, folderName);
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
            destination = fs.createWriteStream(folderPath + PATH.sep + fileName);
            source.pipe(destination);

            /**
             * 完成后删除临时文件
             */
            source.on('end', function () {
                LOGGER.debug("-- END -- | delete temp file");
                fs.unlinkSync(tmpFilePath);
                deferred.resolve(
                    {
                        code: 0,
                        msg: "Success",
                        path: folderName + PATH.sep + fileName
                    }
                );
            });   //delete

            source.on('error', function (err) {
                LOGGER.error(err);
                deferred.reject(
                    {
                        code: -400,
                        msg: err
                    }
                );
            });
        } catch (exception) {
            deferred.reject(
                {
                    code: -400,
                    msg: exception
                }
            );
        }

        return deferred.promise;
    },

    /**
     * 解析Excel文件
     * @param upload
     * @returns {Promise|*|promise}
     */
    excelReader: function (upload) {
        var
            list,
            deferred = Q.defer();

        if (typeof upload === "undefined" || !upload.hasOwnProperty('path')) {
            deferred.reject(
                {
                    code: -400,
                    msg: "No file upload."
                }
            );
        } else {
            try {
                list = XLSX.parse(upload['path']);

                deferred.resolve(
                    {
                        code: 0,
                        msg: "Success",
                        data: list[0].data
                    }
                );
            } catch (exception) {
                deferred.reject(
                    {
                        code: -400,
                        msg: exception
                    }
                );
            }
        }

        return deferred.promise;
    },

    /**
     * 读取 - 图像文件
     * 实现图片预览功能
     * @param root
     * @param subFolder
     * @param file
     * @returns {*}
     */
    paint: function (root, subFolder, file) {
        var filePath,
            content,
            fileInfo;

        filePath = PATH.join(PATH.resolve(__dirname, '..', '..'), root, subFolder, file);
        LOGGER.info("fileSystem.js ==> paint ==> path | " + filePath);
        // 判断文件是否存在
        if (fs.existsSync(filePath)) {
            // 读取文件 --  同步
            content = fs.readFileSync(filePath);
            // 获取文件类型
            fileInfo = IMAGEINFO(content);
            return {
                code: 0,
                content: content,
                info: fileInfo
            };
        } else {
            return {
                code: -100,
                msg: "File not found"
            }
        }
        /* end of if */
    },

    /**
     * 拷贝 -- 文件
     * @param filePath
     * @param sourceRootFolder
     * @param destinationRootFolder
     * @returns {*|Promise|promise}
     */
    copy: function (filePath, sourceRootFolder, destinationRootFolder) {
        var
            reader,
            writer,
            deferred = Q.defer(),
            beginning = PATH.resolve(__dirname, '..', '..'),
            source = PATH.join(beginning, sourceRootFolder, filePath),
            destination = PATH.join(beginning, destinationRootFolder, filePath);

        if (!fs.existsSync(source)) {
            console.info("fileSystem.js ==> copy ==> Target not exist!! Source path: " + source);
            deferred.reject(
                {
                    code: -400,
                    msg: "Target not exist!! Source path: " + source
                }
            );

        } else {
            // 检查目标路径是否存在
            check(destination);

            reader = fs.createReadStream(source);
            writer = fs.createWriteStream(destination);
            reader.pipe(writer);

            /**
             * 完成后删除临时文件
             */
            reader.on('end', function () {
                console.info("fileSystem.js ==> copy ==> Complete!");
                deferred.resolve(
                    {
                        code: 0,
                        msg: "Success",
                        path: filePath
                    }
                );
            });

            reader.on('error', function (err) {
                console.info(err);
                deferred.reject(
                    {
                        code: -400,
                        msg: err
                    }
                );
            });
        }

        return deferred.promise;
    },

    /**
     * 批量拷贝
     * @param gallery   -   文件相对路径数组
     * @param sourceRootFolder      -   源文件夹名
     * @param destinationRootFolder -   目标文件夹名
     * @returns {*|Promise|promise}
     */
    batchCopy: function (gallery, sourceRootFolder, destinationRootFolder) {
        var promises = [],
            deferred = Q.defer();

        gallery.forEach(function (path) {
            console.info(path.imageurl);
            promises.push(api.copy(path.imageurl, sourceRootFolder, destinationRootFolder));
        });

        Q.all(promises)
            .then(
                function (result) {
                    var i = 0,
                        paths = [];

                    console.info("==>  Q.all  ==>  callback ==> success");
                    result.forEach(function (element) {
                        paths[i++] = element.path;
                    });

                    deferred.resolve({
                        code: 0,
                        msg: "Success",
                        paths: paths
                    });
                },
                function (error) {
                    console.info("==>  Q.all  ==>  callback ==> fail");
                    deferred.reject(error);
                }
            );

        return deferred.promise;
    },

    /**
     * 删除 -- 文件对象
     * @param filePath
     * @returns {*|Promise|promise}
     */
    remove: function (filePath) {
        var
            beginning = PATH.resolve(__dirname, "..", ".."),
            absolutePath = PATH.join(beginning, filePath),
            deferred = Q.defer();

        LOGGER.info("Try to delete [FILE] - " + absolutePath);
        if (fs.existsSync(absolutePath)) {
            fs.unlink(absolutePath, function (err) {
                if (err) {
                    deferred.reject({
                        code: -400,
                        msg: err
                    })
                }
                deferred.resolve({
                    code: 0,
                    msg: "Success - Remove file : " + absolutePath
                })
            })
        } else {
            deferred.resolve({
                code: -100,
                msg: "Not exist - File : " + absolutePath
            })
        }

        return deferred.promise;
    },

    /**
     * 批量删除
     * @param gallery
     * @param rootFolder
     * @returns {*|Promise|promise}
     */
    batchRemove: function (gallery, rootFolder) {
        var promises = [],
            deferred = Q.defer();

        gallery.forEach(function (item) {
            console.info("==>   batchRemove | Relative URL: " + item.imageurl);
            promises.push(api.remove(PATH.join(rootFolder, item.imageurl)));
        });

        Q.all(promises)
            .then(
                function (result) {
                    console.info("==>  Q.all  ==>  callback ==> success");
                    deferred.resolve({
                        code: 0,
                        msg: "Success"
                    });
                },
                function (error) {
                    console.info("==>  Q.all  ==>  callback ==> fail");
                    deferred.reject(error);
                }
            );

        return deferred.promise;
    }
};

module.exports = api;