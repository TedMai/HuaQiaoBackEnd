const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const imageinfo = require('imageinfo');

router.get('/:path', function (req, res, next) {
    var filePath,
        content,
        fileInfo;
    console.log(" ==>   reader.js");
    console.log(req.params);

    try {
        filePath = path.join(path.resolve(process.cwd(), ".."), "screenshot", decodeURIComponent(req.params.path));
        console.info(filePath);
        // 判断文件是否存在
        if (fs.existsSync(filePath)) {
            // 读取文件 --  同步
            content = fs.readFileSync(filePath);
            // 获取文件类型
            fileInfo = imageinfo(content);
            console.info(fileInfo);
            // setHeader(name, value) -  指定一个 HTTP 请求的头部
            // name 参数是要设置的头部的名称。这个参数不应该包括空白、冒号或换行。
            // value 参数是头部的值。这个参数不应该包括换行。
            res.setHeader("Content-Type", fileInfo.mimeType);
            res.writeHead(200, "Ok");
            res.write(content, "binary");            //格式必须为 binary，否则会出错
            res.end();
        } else {
            next(new Error("File not found"));
        }
    } catch (err) {
        next(new Error(err));
    }
});

module.exports = router;