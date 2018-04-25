var express = require('express');
var router = express.Router();
const log4js = require('../services/log4js.service');
const LOGGER = log4js.getLogger(__filename);
const FINANCE = require('../services/finance.service');

/**
 *  中债国债收益率曲线
 */
router.get('/bond/:from-:to', function (req, res, next) {
    LOGGER.info('========================== 经济指标数据 ==========================');
    LOGGER.info(req.params);
    FINANCE.getChinaTreasuryYields(req, function (data) {
        res.json(data);
        LOGGER.info('========================== end ==========================');
    });
});

module.exports = router;
