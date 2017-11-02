const express = require('express');
const router = express.Router();
const render = require('./response');
const api = require('../db/doctor.api');

router.get('/', function (req, res, next) {
    console.log("doctor.js ==> Fetch all doctors");
    api.fetchDoctorList(function (request) {
        render.renderPage(request, res, next);
    });
});

router.get('/add', function (req, res, next) {
    console.log("doctor.js ==> Add new doctor");
    api.addDoctor(req, function (request) {
        render.renderPage(request, res, next);
    });
});

router.get('/edit', function (req, res, next) {
    console.log("doctor.js ==> Edit doctor");
    api.editDoctor(req, function (request) {
        render.renderPage(request, res, next);
    });
});

router.get('/delete', function (req, res, next) {
    console.log("doctor.js ==> Delete doctor");
    api.deleteDoctor(req, function (request) {
        render.renderPage(request, res, next);
    });
});

module.exports = router;
