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

router.post("/table/:name", function (req, res, next) {
    console.log("backbone.js ==> insert.");
    console.log(req.params);
    console.log(req.body);

    api.insert(req, function (request) {
        res.json({
            code: 0,
            msg: "success"
        });
    });
});

router.post("/table/:name/id/:id", function (req, res, next) {
    console.log("backbone.js ==> edit.");
    console.log(req.params);
    console.log(req.body);

    api.update(req, function (request) {
        res.json({
            code: 0,
            msg: "success"
        });
    });
});

module.exports = router;