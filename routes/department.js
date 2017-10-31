const express = require('express');
const router = express.Router();
var api = require('../db/department.api');

router.get('/', function (req, res, next) {
    console.log("department.js ==> Fetch all departments");
    api.fetchDepartmentList(function (response) {
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
    console.log("department.js ==> Add new department");
    api.addDepartment(req, function (response) {
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
