const express = require('express');
const router = express.Router();
const log4js = require("../services/log4js.service");
const LOGGER = log4js.getLogger("default");
const SMS = require("../services/aliyun.sms.service");
const CREDENTIAL = require("../services/credential.service");
const FILESYSTEM = require("../services/file.system.service");
const RENDER = require('./response');
const BACKBONE = require('../db/shadow.api');
const MESSAGE = require('../db/sms.api');
const USER = require('../db/user.api');

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
 *  登录
 *      -   注册 | 更新账户信息
 */
router.post("/login/type/:type/action/:action", function (req, res, next) {
    LOGGER.info("backbone.js ==> login");
    LOGGER.info(req.params);
    LOGGER.info(req.body);
    LOGGER.info(req.query);
    BACKBONE.login(req, function (request) {
        LOGGER.info("backbone.js ==> login ==> callback");
        res.json(request);
    });
});

/**
 *  删除账户
 */
router.post("/login/:name/id/:id", function (req, res, next) {
    LOGGER.info("backbone.js ==> delete user");
    LOGGER.info(req.params);
    LOGGER.info(req.body);
    LOGGER.info(req.query);
    BACKBONE.delete(req, function (request) {
        res.json(request);
    });
});

/**
 *  第三方登录
 */
router.get('/knock/:code', function (req, res, next) {
    LOGGER.debug("backbone.js ==> fetch openid, session_key, unionId through code");
    LOGGER.info(req.params);
    CREDENTIAL.fetchUserOpenId(req.params.code, function (request) {
        /**
         * 如果openid存在，则启动注册流程
         * 否则，返回错误信息
         */
        if (request.hasOwnProperty('openid')) {
            USER.registerByWeChat({params: {openid: request.openid}},
                function (request) {
                    res.json(request);
                });
        } else {
            res.json({
                code: request.errcode,
                msg: request.errmsg
            });
        }
    })
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
        if (request.result.Code === "OK") {
            MESSAGE.addSms(request, function () {
                res.json(request.result);
            });
        } else {
            // next(new Error(request.Message));
            res.json(request.result.Message);
        }
    });
});

module.exports = router;