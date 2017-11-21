const Q = require('q');
const fs = require('fs');
const path = require('path');
const formatter = require('../db/utility.date');
const imageinfo = require('imageinfo');
const __MAX_UPLOAD_FILE_SIZE__ = 3 * 1024 * 1024;

function check(filePath) {
    var subFilePath;

    if (filePath.lastIndexOf("\\") === -1) {

    } else {
        subFilePath = filePath.substr(0, filePath.lastIndexOf("\\"));
        console.info(subFilePath);
        if (!fs.existsSync(subFilePath)) {
            check(subFilePath);
            fs.mkdirSync(subFilePath);
        }
    }
}

var api = {

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
             * 以当前程序的执行目录为起点，向上一级目录，找到temp文件夹
             * 按照当前日期生成子目录
             * @type {string}
             */
            Date.prototype.format = formatter.format;
            folderName = new Date().format('yyyyMMdd');
            rootPath = path.resolve(process.cwd(), "..") + path.sep + "temp";
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

    paint: function (root, subFolder, file) {
        var filePath,
            content,
            fileInfo;

        filePath = path.join(path.resolve(process.cwd(), ".."), root, subFolder, file);
        console.info(filePath);
        // 判断文件是否存在
        if (fs.existsSync(filePath)) {
            // 读取文件 --  同步
            content = fs.readFileSync(filePath);
            // 获取文件类型
            fileInfo = imageinfo(content);
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

    copy: function (filePath, sourceRootFolder, destinationRootFolder) {
        var
            reader,
            writer,
            deferred = Q.defer(),
            beginning = path.resolve(process.cwd(), ".."),
            source = path.join(beginning, sourceRootFolder, filePath),
            destination = path.join(beginning, destinationRootFolder, filePath);

        if (!fs.existsSync(source)) {
            console.info("Target not exist");
            deferred.reject(
                {
                    code: -400,
                    msg: "Target not exist"
                }
            );

        } else {

            check(destination);

            reader = fs.createReadStream(source);
            writer = fs.createWriteStream(destination);
            reader.pipe(writer);

            /**
             * 完成后删除临时文件
             */
            reader.on('end', function () {
                console.info("Complete!");
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
    }
};

module.exports = api;