const express = require('express');
const router = express.Router();
const multiparty =  require('connect-multiparty');
// const render = require('./response');

router.get('/', function (req, res, next) {
    console.info("==>   processor   | GET");
    res.send("OK");
});

router.post('/', function (req, res, next) {
    console.info("==>   processor   | POST");
    var form = new multiparty.Form();
    console.info(req.payload);
    form.parse(req.payload, function(err, fields, files) {
        console.info(files);
    });

    res.send("OK");
});

module.exports = router;
