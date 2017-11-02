const express = require('express');
const router = express.Router();
const render = require('./response');
const api = require('../db/hospital.api');

router.get('/', function (req, res, next) {
    console.log("hospital.js ==> Fetch all hospitals");
    api.fetchHospitalList(function (request) {
        render.renderPage(request, res, next);
    });
});

router.get('/add', function (req, res, next) {
    console.log("hospital.js ==> Add new hospital");
    api.addHospital(req, function (request) {
        render.renderPage(request, res, next);
    });
});

router.get('/edit', function (req, res, next) {
    console.log("hospital.js ==> Edit hospital");
    api.editHospital(req, function (request) {
        render.renderPage(request, res, next);
    });
});

router.get('/delete', function (req, res, next) {
    console.log("hospital.js ==> Delete hospital");
    api.deleteHospital(req, function (request) {
        render.renderPage(request, res, next);
    });
});

module.exports = router;
