const express = require('express');
const router = express.Router();
const render = require('./response');
const api = require('../db/department.api');

router.get('/', function (req, res, next) {
    console.log("department.js ==> Fetch all departments");
    api.fetchDepartmentList(function (request) {
        render.renderPage(request, res, next);
    });
});

router.get('/add', function (req, res, next) {
    console.log("department.js ==> Add new department");
    api.addDepartment(req, function (request) {
        render.renderPage(request, res, next);
    });
});

router.get('/edit', function (req, res, next) {
    console.log("department.js ==> Edit department");
    api.editDepartment(req, function (request) {
        render.renderPage(request, res, next);
    });
});

router.get('/delete', function (req, res, next) {
    console.log("department.js ==> Delete department");
    api.deleteDepartment(req, function (request) {
        render.renderPage(request, res, next);
    });
});

module.exports = router;
