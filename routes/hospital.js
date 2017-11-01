const express = require('express');
const router = express.Router();
var api = require('../db/hospital.api');

router.get('/', function (req, res, next) {
    console.log("hospital.js ==> Fetch all hospitals");
    api.fetchHospitalList(function (response) {
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
    console.log("hospital.js ==> Add new hospital");
    api.addHospital(req, function (response) {
        if (0 === response.code) {
            res.json(response.msg);
        } else {
            var err = new Error(response.msg);
            err.status = response.code;
            next(new Error(response.msg));
        }
    });
});

router.get('/edit', function (req, res, next) {
    console.log("hospital.js ==> Edit hospital");
    api.editHospital(req, function (response) {
        if (0 === response.code) {
            res.json(response.msg);
        } else {
            var err = new Error(response.msg);
            err.status = response.code;
            next(new Error(response.msg));
        }
    });
});

router.get('/delete', function (req, res, next) {
    console.log("hospital.js ==> Delete hospital");
    api.deleteHospital(req, function (response) {
        if (0 === response.code) {
            res.json(response.msg);
        } else {
            var err = new Error(response.msg);
            err.status = response.code;
            next(new Error(response.msg));
        }
    });
});


module.exports = router;
