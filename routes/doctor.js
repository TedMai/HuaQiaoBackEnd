const express = require('express');
const router = express.Router();
var api = require('../db/doctor.api');

router.get('/', function (req, res, next) {
    console.log("doctor.js ==> Fetch all doctors");
    api.fetchDoctorList(function (response) {
        if (0 === response.code) {
            res.json(response.msg);
        } else {
            var err = new Error(response.msg);
            err.status = response.code;
            next(new Error(response.msg));
        }
    });
});

router.get('/add', function (req, res, next) {
    console.log("doctor.js ==> Add new doctor");
    api.addDoctor(req, function (response) {
        if (0 === response.code) {
            res.json(response.msg);
        } else {
            console.log("doctor.js ==> Add new doctor ==> Error");
            var err = new Error(response.msg);
            err.status = response.code;
            next(new Error(response.msg));
        }
    });
});

module.exports = router;
