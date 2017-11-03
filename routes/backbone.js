const express = require('express');
const router = express.Router();
const render = require('./response');
const api = require('../db/shadow.api');

router.get('/', function (req, res, next) {
    console.log("shadow.js ==> Fetch data set.");
    api.initialization(function (request) {
        render.renderPage(request, res, next);
    });
});

module.exports = router;