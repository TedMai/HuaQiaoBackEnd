const express = require('express');
const router = express.Router();
const log4js = require("../services/log4js.service");
const LOGGER = log4js.getLogger("default");
const SMS = require("../services/aliyun.sms.service");
const RENDER = require('./response');
const BACKBONE = require('../db/shadow.api');
const FILESYSTEM = require("../services/file.system.service");

/**
 *   初始化 - 后台首页
 */
router.get('/', function (req, res, next) {
    BACKBONE.initialization(req, function (request) {
        RENDER.renderPage(request, res, next);
    });
});

/**
 *   初始化 - select
 *   上一级目录
 */
router.get("/select/:name", function (req, res, next) {
    LOGGER.info("backbone.js ==> Initialize select | superior");
    LOGGER.info(req.params);
    BACKBONE.selectSuperior(req, function (request) {
        LOGGER.info("backbone.js ==> selectSuperior ==> callback");
        RENDER.renderPage(request, res, next);
    });
});

/**
 *   初始化 - select
 *   下一级目录
 */
router.get("/select/:name/id/:id", function (req, res, next) {
    LOGGER.info("backbone.js ==> Initialize select | subordinate");
    LOGGER.info(req.params);
    BACKBONE.selectSubordinate(req, function (request) {
        LOGGER.info("backbone.js ==> selectSubordinate ==> callback");
        RENDER.renderPage(request, res, next);
    });
});

/**
 *   查询 - 获取列表
 */
router.get("/table/:name", function (req, res, next) {
    LOGGER.info("backbone.js ==> fetch");
    LOGGER.info(req.params);
    LOGGER.info(req.body);
    LOGGER.info(req.query);
    BACKBONE.fetch(req, function (request) {
        LOGGER.info("backbone.js ==> fetch ==> callback");
        RENDER.renderPage(request, res, next);
    })
});

/**
 *   查询 - 指定对象
 */
router.get("/table/:name/id/:id", function (req, res, next) {
    LOGGER.info("backbone.js ==> query");
    LOGGER.info(req.params);
    LOGGER.info(req.body);
    LOGGER.info(req.query);
    BACKBONE.query(req, function (request) {
        LOGGER.info("backbone.js ==> query ==> callback");
        RENDER.renderPage(request, res, next);
    });
});

/**
 *   查询 - 与之相关联的对象数组
 */
router.get("/table/:name/relatives/:id", function (req, res, next) {
    LOGGER.info("backbone.js ==> relatives");
    LOGGER.info(req.params);
    LOGGER.info(req.body);
    LOGGER.info(req.query);
    BACKBONE.relatives(req, function (request) {
        LOGGER.info("backbone.js ==> relatives ==> callback");
        RENDER.renderPage(request, res, next);
    });
});

/**
 *  搜索
 */
router.get("/table/:name/field/:field/term/:term", function (req, res, next) {
    LOGGER.info("backbone.js ==> search");
    LOGGER.info(req.params);
    LOGGER.info(req.body);
    LOGGER.info(req.query);
    BACKBONE.search(req, function (request) {
        LOGGER.info("backbone.js ==> search ==> callback");
        RENDER.renderPage(request, res, next);
    });
});

/**
 *  新增 | 更新
 */
router.post("/table/:name", function (req, res, next) {
    LOGGER.info("backbone.js ==> insert | edit");
    LOGGER.info(req.params);
    LOGGER.info(req.body);
    LOGGER.info(req.query);
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
    LOGGER.info("backbone.js ==> delete");
    LOGGER.info(req.params);
    LOGGER.info(req.body);
    LOGGER.info(req.query);
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

/**
 *  发送短信
 */
router.get('/sms/:phone/type/:type', function (req, res, next) {
    LOGGER.debug("backbone.js ==> send sms");
    LOGGER.info(req.params);

    SMS.send(req, function (request) {
        if (request.hasOwnProperty("Code") && request.Code === "OK") {
            res.json(request);
        } else {
            next(new Error(request.Message));
        }
    });

});

module.exports = router;