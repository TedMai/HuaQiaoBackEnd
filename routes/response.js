const log4js = require("../services/log4js.service");
const LOGGER = log4js.getLogger("default");

module.exports = {

    renderPage: function (request, response, next) {
        //LOGGER.info(request);
        if (0 === request.code) {
            response.json(request.msg);
        } else {
            var err = new Error(request.msg);
            next(err);
        }
    }

};