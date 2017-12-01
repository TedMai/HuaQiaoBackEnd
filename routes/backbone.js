const express = require('express');
const router = express.Router();
const render = require('./response');
const BACKBONE = require('../db/shadow.api');
// const HOSPITAL = require('../db/hospital.api');

router.get('/', function (req, res, next) {
    console.log("backbone.js ==> Fetch data set.");
    BACKBONE.initialization(req, function (request) {
        console.info("backbone.js ==> Render page.");
        render.renderPage(request, res, next);
    });
});

router.get("/select/:name", function (req, res, next) {
    console.log("backbone.js ==> Initialize select ..");
    console.log(req.params);

    BACKBONE.selectOptions(req, function (request) {
        console.log("backbone.js ==> selectOptions ==> callback");
        console.info(request);
        res.json(request);
    });

});

router.get("/table/:name/id/:id", function (req, res, next) {
    console.log("backbone.js ==> query");
    console.log(req.params);
    console.log(req.body);
    console.log(req.query);

    BACKBONE.query(req, function (request) {
        console.log("backbone.js ==> query ==> callback");
        console.info(request);
        res.json(request);
    });
});

// router.get("/test/:name", function (req, res, next) {
//     console.log("backbone.js ==> test");
//     console.log(req.params);
//     console.log(req.body);
//     console.log(req.query);
//
//     if (req.query && req.query.hasOwnProperty("id")) {
//         BACKBONE.update(req, function (request) {
//             res.json(request);
//         });
//     } else {
//         BACKBONE.insert(req, function (request) {
//             res.json(request);
//         });
//     }
// });
//
// router.get("/test/:name/id/:id", function (req, res, next) {
//     console.log("backbone.js ==> delete");
//     console.log(req.params);
//     console.log(req.body);
//     console.log(req.query);
//
//     BACKBONE.delete(req, function (request) {
//         res.json(request);
//     });
// });

router.post("/table/:name", function (req, res, next) {
    console.log("backbone.js ==> insert | edit");
    console.log(req.params);
    console.log(req.body);
    console.log(req.query);

    if (req.query && req.query.hasOwnProperty("id")) {
        BACKBONE.update(req, function (request) {
            res.json(request);
        });
    } else {
        BACKBONE.insert(req, function (request) {
            res.json(request);
        });
    }
});

router.post("/table/:name/id/:id", function (req, res, next) {
    console.log("backbone.js ==> delete");
    console.log(req.params);
    console.log(req.body);
    console.log(req.query);

    BACKBONE.delete(req, function (request) {
        res.json(request);
    });
});

module.exports = router;