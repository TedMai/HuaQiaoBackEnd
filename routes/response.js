module.exports = {

    renderPage: function (request, response, next) {
        if (0 === request.code) {
            response.json(request.msg);
        } else {
            var err = new Error(request.msg);
            err.status = request.code;
            next(err);
        }
    }

};