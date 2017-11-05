module.exports = {

    renderPage: function (request, response, next) {
        if (0 === request.code) {
            response.json(request.msg);
        } else {
            var err = new Error(request.msg);
            next(err);
        }
    }

};