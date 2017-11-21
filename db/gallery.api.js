const HANDLER = require('./mysql.handler');
const EXEC_SQL = require('./gallery.interface');

var api = {

    fetchGallery: function (request, response) {

        HANDLER
            .setUpConnection(
                {
                    tableName: 'gallery',
                    execSQL: EXEC_SQL.fetchPictureList,
                    values: [request.params.type, request.params.id]
                }
            )
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