const express = require('express');
const router = express.Router();
const RENDER = require('./response');
const BACKBONE = require('../db/shadow.api');
const FILESYSTEM = require("./fileSystem");
const log4js = require("../services/log4js.service");
const LOGGER = log4js.getLogger("default");

/**
 *   初始化 - 后台首页
 */
router.get('/', function (req, res, next) {
    console.log("backbone.js ==> Fetch data set.");
    BACKBONE.initialization(req, function (request) {
        console.info("backbone.js ==> Render page.");
        RENDER.renderPage(request, res, next);
    });
});

/**
 *   初始化 - select
 */
router.get("/select/:name", function (req, res, next) {
    console.log("backbone.js ==> Initialize select ..");
    console.log(req.params);
    BACKBONE.selectOptions(req, function (request) {
        console.log("backbone.js ==> selectOptions ==> callback");
        console.info(request);
        res.json(request);
    });
});

/**
 *   查询 - 获取列表
 */
router.get("/table/:name", function (req, res, next) {
    console.log("backbone.js ==> fetch");
    console.log(req.params);
    console.log(req.body);
    console.log(req.query);
    BACKBONE.fetch(req, function (request) {
        console.log("backbone.js ==> fetch ==> callback");
        console.info(request);
        RENDER.renderPage(request, res, next);
    })
});

/**
 *   查询 - 指定条件
 */
router.get("/table/:name/id/:id", function (req, res, next) {
    console.log("backbone.js ==> query");
    console.log(req.params);
    console.log(req.body);
    console.log(req.query);
    BACKBONE.query(req, function (request) {
        console.log("backbone.js ==> query ==> callback");
        console.info(request);
        RENDER.renderPage(request, res, next);
    });
});

/**
 *  搜索
 */
router.get("/table/:name/field/:field/term/:term", function (req, res, next) {
    console.log("backbone.js ==> search");
    console.log(req.params);
    console.log(req.body);
    console.log(req.query);
    BACKBONE.search(req, function (request) {
        console.log("backbone.js ==> search ==> callback");
        console.info(request);
        RENDER.renderPage(request, res, next);
    });
});

/**
 *  新增 | 更新
 */
router.post("/table/:name", function (req, res, next) {
    console.log("backbone.js ==> insert | edit");
    console.log(req.params);
    console.log(req.body);
    console.log(req.query);
    if (req.query && req.query.hasOwnProperty("id")) {
        BACKBONE.update(req, function (request) {
            res.json(request);
        });
    } else {
        BACKBONE.insert(req, function (request) {
            res.json(request);
        });
    }
});

/**
 *  删除
 */
router.post("/table/:name/id/:id", function (req, res, next) {
    console.log("backbone.js ==> delete");
    console.log(req.params);
    console.log(req.body);
    console.log(req.query);
    BACKBONE.delete(req, function (request) {
        res.json(request);
    });
});

/**
 *  图片预览
 */
router.get('/image/:root/:path/:file', function (req, res, next) {
    var result;

    LOGGER.debug("backbone.js ==> image preview");
    LOGGER.info(req.params);

    try {
        result = FILESYSTEM.paint(req.params.root, req.params.path, req.params.file);
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

module.exports = router;