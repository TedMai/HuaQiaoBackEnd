const Q = require('q');
const __LOG4JS__ = require("../services/log4js.service");
const __LOGGER__ = __LOG4JS__.getLogger("default");
const __CREDENTIAL__ = require("../services/credential.service");

var HealthBureauService = {
    getSpecificPatientIdCard: function (request) {
        var deferred = Q.defer();
        __LOGGER__.log('==> getSpecificPatientIdCard | phone - ' + request.body.phone + ' name - ' + request.body.name)
        deferred.resolve({
            session: request.body.session,
            cardid: __CREDENTIAL__.getNonceStr(9)
        });
        return deferred.promise;
    }
};

module.exports = HealthBureauService;
