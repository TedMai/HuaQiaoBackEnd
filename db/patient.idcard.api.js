const HANDLER = require('./mysql.handler');
const EXEC_SQL = require('./patient.idcard.interface');

var api = {

    addPatientIDCard: function (request, response) {
        HANDLER
            .setUpConnection({
                sqlBasicInfo: EXEC_SQL.addPatientIDCard,
                information: {
                    cardid: 'B26935701',
                    name: '李云鹏',
                    phone: '18132432342',
                    openid: 'oCPHfsjWqQWPA-U0DDMlqrkhvfm8'
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

    isPatientIDCardExist: function (request, response) {
        HANDLER
            .setUpConnection({
                sqlIsExist: EXEC_SQL.isPatientIDCardExist,
                queryCondition: [
                    request.openid
                ]
            })
            .then(HANDLER.isExist)
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

// api.addPatientIDCard({}, function (response) {
//     console.log(response);
// });