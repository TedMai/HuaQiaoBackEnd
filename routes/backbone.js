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
    LOGGER.info("========================== initialization ==========================");
    BACKBONE.initialization(req, function (request) {
        RENDER.renderPage(request, res, next);
        LOGGER.info("========================== end ==========================");
    });
});

/**
 *   初始化 - select
 *   上一级目录
 */
router.get("/select/:name", function (req, res, next) {
    LOGGER.info("========================== Initialize select | superior ==========================");
    LOGGER.info(req.params);
    BACKBONE.selectSuperior(req, function (request) {
        RENDER.renderPage(request, res, next);
        LOGGER.info("========================== end ==========================");
    });
});

/**
 *   初始化 - select
 *   下一级目录
 */
router.get("/select/:name/id/:id", function (req, res, next) {
    LOGGER.info("========================== Initialize select | subordinate ==========================");
    LOGGER.info(req.params);
    BACKBONE.selectSubordinate(req, function (request) {
        RENDER.renderPage(request, res, next);
        LOGGER.info("========================== end ==========================");
    });
});

/**
 *   查询 - 获取列表
 */
router.get("/table/:name", function (req, res, next) {
    LOGGER.info("========================== fetch | /table/:name ==========================");
    LOGGER.info(req.params);
    LOGGER.info(req.body);
    LOGGER.info(req.query);
    BACKBONE.fetch(req, function (request) {
        RENDER.renderPage(request, res, next);
        LOGGER.info("========================== end ==========================");
    })
});

/**
 *   查询 - 指定对象
 */
router.get("/table/:name/id/:id", function (req, res, next) {
    LOGGER.info("========================== query | /table/:name/id/:id ==========================");
    LOGGER.info(req.params);
    LOGGER.info(req.body);
    LOGGER.info(req.query);
    BACKBONE.query(req, function (request) {
        RENDER.renderPage(request, res, next);
        LOGGER.info("========================== end ==========================");
    });
});

/**
 *   查询 - 与之相关联的对象数组
 */
router.get("/table/:name/relatives/:id", function (req, res, next) {
    LOGGER.info("========================== relatives | /table/:name/relatives/:id ==========================");
    LOGGER.info(req.params);
    LOGGER.info(req.body);
    LOGGER.info(req.query);
    BACKBONE.relatives(req, function (request) {
        RENDER.renderPage(request, res, next);
        LOGGER.info("========================== end ==========================");
    });
});

/**
 *  搜索
 */
router.get("/table/:name/field/:field/term/:term", function (req, res, next) {
    LOGGER.info("========================== search | /table/:name/field/:field/term/:term ==========================");
    LOGGER.info(req.params);
    LOGGER.info(req.body);
    LOGGER.info(req.query);
    BACKBONE.search(req, function (request) {
        RENDER.renderPage(request, res, next);
        LOGGER.info("========================== end ==========================");
    });
});

/**
 *  新增 | 更新
 */
router.post("/table/:name", function (req, res, next) {
    LOGGER.info("========================== insert or edit | /table/:name ==========================");
    LOGGER.info(req.params);
    LOGGER.info(req.body);
    LOGGER.info(req.query);
    if (req.query && req.query.hasOwnProperty("id")) {
        BACKBONE.update(req, function (request) {
            res.json(request);
            LOGGER.info("========================== end ==========================");
        });
    } else {
        BACKBONE.insert(req, function (request) {
            res.json(request);
            LOGGER.info("========================== end ==========================");
        });
    }
});

/**
 *  删除
 */
router.post("/table/:name/id/:id", function (req, res, next) {
    LOGGER.info("========================== delete | /table/:name/id/:id ==========================");
    LOGGER.info(req.params);
    LOGGER.info(req.body);
    LOGGER.info(req.query);
    BACKBONE.delete(req, function (request) {
        res.json(request);
        LOGGER.info("========================== end ==========================");
    });
});

/**
 *  登录
 *      -   注册 | 更新账户信息
 */
router.post("/login/type/:type/action/:action", function (req, res, next) {
    LOGGER.info("========================== login | /login/type/:type/action/:action ==========================");
    LOGGER.info(req.params);
    LOGGER.info(req.body);
    LOGGER.info(req.query);
    BACKBONE.login(req, function (request) {
        res.json(request);
        LOGGER.info("========================== end ==========================");
    });
});

/**
 *  删除账户
 */
router.post("/login/:name/id/:id", function (req, res, next) {
    LOGGER.info("========================== delete user | /login/:name/id/:id ==========================");
    LOGGER.info(req.params);
    LOGGER.info(req.body);
    LOGGER.info(req.query);
    BACKBONE.delete(req, function (request) {
        res.json(request);
        LOGGER.info("========================== end ==========================");
    });
});

/**
 *  第三方登录
 */
router.get('/knock/:code', function (req, res, next) {
    LOGGER.info("========================== fetch openid, session_key, unionId through code ==========================");
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
                    LOGGER.info("========================== end ==========================");
                });
        } else {
            res.json({
                code: request.errcode,
                msg: request.errmsg
            });
            LOGGER.info("========================== end ==========================");
        }
    })
});

/**
 *  图片预览
 */
router.get('/image/:root/:path/:file', function (req, res, next) {
    var result;

    LOGGER.info("========================== image preview | /image/:root/:path/:file ==========================");
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
    LOGGER.info("========================== end ==========================");
});

/**
 *  发送短信
 */
router.get('/sms/:phone/type/:type', function (req, res, next) {
    LOGGER.info("========================== send sms | /sms/:phone/type/:type ==========================");
    LOGGER.info(req.params);
    SMS.send(req, function (request) {
        if (request.result.Code === "OK") {
            MESSAGE.addSms(request, function () {
                res.json(request.result);
                LOGGER.info("========================== end ==========================");
            });
        } else {
            // next(new Error(request.Message));
            res.json(request.result.Message);
            LOGGER.info("========================== end ==========================");
        }
    });
});

module.exports = router;