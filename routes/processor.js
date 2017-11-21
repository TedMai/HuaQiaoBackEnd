const Q = require('q');
const express = require('express');
const router = express.Router();
const multipart = require('connect-multiparty');
const fileSystem = require("./fileSystem");
const __MAX_UPLOAD_FILE_NUM__ = 9;

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

router.get('/:root/:path/:file', function (req, res, next) {
    var filePath,
        content,
        fileInfo;
    console.log(" ==>   reader.js");
    console.log(req.params);

    try {
        filePath = path.join(path.resolve(process.cwd(), ".."), req.params.root, req.params.path, req.params.file);
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

router.get("/temp/:type/:id", function (req, res, next) {

    console.info(req.params);

    gallery.fetchGallery(req, function (request) {
        res.json(request);
    });
});

module.exports = router;
