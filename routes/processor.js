const fs = require('fs');
const path = require('path');
const express = require('express');
const router = express.Router();
const multipart = require('connect-multiparty');
const __MAX_UPLOAD_FILE_SIZE__ = 5 * 1024 * 1024;

router.post('/', multipart(), function (req, res, next) {
    var tmpFilePath,
        fileName,
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

    Date.prototype.Format = function (fmt) {
        var o = {
            "M+": this.getMonth() + 1, //月份
            "d+": this.getDate(), //日
            "h+": this.getHours(), //小时
            "m+": this.getMinutes(), //分
            "s+": this.getSeconds(), //秒
            "q+": Math.floor((this.getMonth() + 3) / 3), //季度
            "S": this.getMilliseconds() //毫秒
        };
        if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
        for (var k in o)
            if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        return fmt;
    };

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

    /**
     * 文件上传的保存目录
     * 以当前程序的执行目录为起点，向上一级目录，找到screenshot
     * 按照当前日期生成子目录
     * @type {string}
     */
    folderName = new Date().Format('yyyyMMdd');
    folderPath = path.resolve(process.cwd(), "..") + path.sep + "screenshot" + path.sep + folderName;
    // 保存目录不存在，则创建
    if (!fs.existsSync(folderPath)) {
        fs.mkdir(folderPath, function (err) {
            if (err) {
                res.json({
                    code: 400,
                    msg: "File upload failed."
                });
                return;
            }
            console.info("Create folder success");
        });
    }

    /**
     * 将文件从临时文件夹复制至目标文件夹
     */
    tmpFilePath = req.files['file']['path'];
    fileName = new Date().Format('yyyyMMddhhmmssS') + Math.round(Math.random() * 1000) + "_" + req.files['file']['name'];
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
});

module.exports = router;
