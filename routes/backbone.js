const express = require('express');
const router = express.Router();
const render = require('./response');
const api = require('../db/shadow.api');

router.get('/', function (req, res, next) {
    console.log("backbone.js ==> Fetch data set.");
    api.initialization(req, function (request) {
        console.info("backbone.js ==> Render page.");
        render.renderPage(request, res, next);
    });
});

router.get('/table/:name/id/:id', function (req, res, next) {
    console.log("backbone.js ==> Fetch specific item.");
    console.log(req.params);
    console.log(req.body);

    api.query(req, function (request) {

    });
});

router.get("/select/:name", function (req, res, next) {
    console.log("backbone.js ==> Initialize select ..");
    console.log(req.params);

    api.selectOptions(req, function (request) {
        console.log("backbone.js ==> selectOptions ==> callback");
        console.info(request);
        res.json(request);
    });

});

router.get("/test", function (req, res, next) {
    console.log("backbone.js ==> test");
    console.log(req.params);

    api.test(req, function (request) {
        console.log("backbone.js ==> deleteHospital ==> callback");
        console.info(request);
        res.json(request);
    });
});

router.post("/table/:name", function (req, res, next) {
    console.log("backbone.js ==> insert | edit");
    console.log(req.params);
    console.log(req.body);
    console.log(req.query);

    if (req.query && req.query.hasOwnProperty("id")) {
        api.update(req, function (request) {
            res.json(request);
        });
    } else {
        api.insert(req, function (request) {
            res.json(request);
        });
    }
});

router.post("/table/:name/id/:id", function (req, res, next) {
    console.log("backbone.js ==> delete");
    console.log(req.params);
    console.log(req.body);
    console.log(req.query);

    api.delete(req, function (request) {
        res.json(request);
    });
});

module.exports = router;