const HANDLER = require('./mysql.handler');
const EXEC_SQL = require('./report.interface');

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
                information: {
                    title: 'XXXXXXXXXXX',
                    sample: 'XXXXXXXXXXXX',
                    cardid: 'B26935701'
                }
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
                // values: ['kt9fTuF8i5AbMhywJfvIGA15XD6qwm0p', '2018/3/2', '2018/3/15']
                values: [request.query.session, request.params.from, request.params.to]
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

// api.addReport({}, function (result) {
//     console.log(result);
// });

// api.queryRelativeReport({}, function (result) {
//     console.log(result);
// });