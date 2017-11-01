const HANDLER = require('./mysql.handler');
const EXEC_SQL = require('./doctor.interface');

var api = {
    addDoctor: function (req, res) {

    },

    editDoctor: function (req, res) {

    },

    deleteDoctor: function (req, res) {

    },

    fetchDoctorList: function (response) {

        HANDLER
            .setUpConnection({
                execSQL: EXEC_SQL.fetchDoctorList,
                values: null
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