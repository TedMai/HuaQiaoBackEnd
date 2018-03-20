const HANDLER = require('./mysql.handler');
const EXEC_SQL = require('./report.interface');
const __CREDENTIAL__ = require("../services/credential.service");

var api = {

    /**
     * 新增 - 报告单
     * @param request
     * @param response
     */
    addReport: function (request, response) {

        HANDLER
            .setUpConnection({
                sqlBasicInfo: EXEC_SQL.addReport,
                // information: request.body.information,
                information: request
            })
            .then(HANDLER.beginTransaction)
            .then(HANDLER.setBasicInfo)
            .then(HANDLER.commitTransaction)
            .then(HANDLER.cleanup)
            .then(function (result) {
                response(result);
            })
            .catch(function (request) {
                HANDLER.onRejectWithRollback(request, response);
            });
    },

    /**
     * 新增 - 检查项
     * @param request
     * @param response
     */
    addInspection: function (request, response) {

        HANDLER
            .setUpConnection({
                sqlBasicInfo: EXEC_SQL.addInspection,
                information: request
            })
            .then(HANDLER.beginTransaction)
            .then(HANDLER.setBasicInfo)
            .then(HANDLER.commitTransaction)
            .then(HANDLER.cleanup)
            .then(function (result) {
                response(result);
            })
            .catch(function (request) {
                HANDLER.onRejectWithRollback(request, response);
            });
    },

    queryRelativeReport: function (request, response) {

        HANDLER
            .setUpConnection({
                execSQL: EXEC_SQL.queryReportInRange,
                // values: ['VcT2yIm0rCPsGsmmgVX01IGKZ3gxvZhH', '2018/3/2', '2018/3/15']
                values: [request.query.session, request.params.from, request.params.to]
                //values: ['VcT2yIm0rCPsGsmmgVX01IGKZ3gxvZhH', request.params.from, request.params.to]
            })
            .then(HANDLER.fetchList)
            .then(HANDLER.cleanup)
            .then(function (result) {
                response(result);
            })
            .catch(function (request) {
                HANDLER.onReject(request, response);
            });

    },

    queryRelativeInspection: function (request, response) {
        HANDLER
            .setUpConnection({
                execSQL: EXEC_SQL.queryRelativeInspection,
                values: [request.params.id]
            })
            .then(HANDLER.fetchList)
            .then(HANDLER.cleanup)
            .then(function (result) {
                response(result);
            })
            .catch(function (request) {
                HANDLER.onReject(request, response);
            });
    }
};

module.exports = api;

// function addDate(date, days) {
//     var d = new Date(date);
//     d.setDate(d.getDate() + days);
//     var m = d.getMonth();
//     return d.getFullYear() + '-' + m + '-' + d.getDate();
// }
//
// for (var i = 0; i < 30; i++) {
//     api.addReport({
//         title: '血细胞分析（五分类）',
//         sample: '血',
//         create_time: addDate(new Date().getTime(), i),
//         cardid: 'B26935701'
//     }, function (result) {
//         console.log(result);
//     });
// }

// api.addInspection({
//     itemid: __CREDENTIAL__.getNonceStr(32),
//     name: '*血红蛋白',
//     result: '122',
//     reference: '115-150',
//     unit: 'g/L',
//     reportid: 127
// }, function (result) {
//     console.log(result);
// });

// api.queryRelativeReport({}, function (result) {
//     console.log(result);
// });

// api.queryRelativeInspection({}, function (result) {
//     console.log(result);
// });
