const Q = require('q');
const fs = require('fs');
const path = require('path');
const express = require('express');
const router = express.Router();
const multipart = require('connect-multiparty');
const formatter = require('../db/utility.date');
const __MAX_UPLOAD_FILE_SIZE__ = 3 * 1024 * 1024;

router.post('/', multipart(), function (req, res, next) {
    var tmpFilePath,
        fileName,
        rootPath,
        folderName,
        folderPath,
        source,
        destination;

    console.info("==>   processor   | POST");
    console.info(req.files);
    if (typeof(req.files) === "undefined" || !req.files.hasOwnProperty('file')) {
        res.json({
            code: 400,
            msg: "Empty. File not found."
        });
        return;
    }

    /**
     * 检查上传文件的格式
     */
    if (req.files['file']['type'] !== 'image/jpeg' &&
        req.files['file']['type'] !== 'image/jpg' &&
        req.files['file']['type'] !== 'image/png') {
        res.json({
            code: 400,
            msg: "Incorrect file format."
        });
        return;
    }

    /**
     * 检查上传文件的大上
     * 不能超过5MB
     */
    if (req.files['file']['size'] > __MAX_UPLOAD_FILE_SIZE__) {
        res.json({
            code: 400,
            msg: "File is too large to upload."
        });
        return;
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
        tmpFilePath = req.files['file']['path'];
        fileName = new Date().format('yyyyMMddhhmmssS') + Math.round(Math.random() * 1000) + "_" + req.files['file']['name'];
        source = fs.createReadStream(tmpFilePath);
        destination = fs.createWriteStream(folderPath + path.sep + fileName);
        source.pipe(destination);

        /**
         * 完成后删除临时文件
         */
        source.on('end', function () {
            console.info("-- END -- | delete temp file");
            fs.unlinkSync(tmpFilePath);
            res.json({
                code: 0,
                msg: "Success",
                path: folderName + path.sep + fileName
            });
        });   //delete

        source.on('error', function (err) {
            console.info(err);
            res.json({
                code: 400,
                msg: err
            });
        });
    } catch (exception) {
        res.json({
            code: 400,
            msg: exception
        });
    }
});

module.exports = router;
