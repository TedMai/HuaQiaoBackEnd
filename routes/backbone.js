const express = require('express');
const router = express.Router();
const render = require('./response');
const api = require('../db/shadow.api');

router.get('/', function (req, res, next) {
    console.log("shadow.js ==> Fetch data set.");
    api.initialization(req, function (request) {
        console.info("shadow.js ==> Render page.");
        render.renderPage(request, res, next);
    });
});

module.exports = router;