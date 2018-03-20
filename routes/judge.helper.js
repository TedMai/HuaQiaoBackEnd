const __PATIENT_ID_CARD__ = require('../db/patient.idcard.api');
const __USER__ = require('../db/user.api');

var api = {
    fetch: function (request, response) {

        switch (request.params.name) {
            case 'card':
                __PATIENT_ID_CARD__.fetchCardList(request, response);
                break;
            case 'user':
                __USER__.getUserInfo(request, response);
                break;
            default:
                response({
                    code: -100,
                    msg: "Parameter - " + request.params.name + " not found."
                });
                break;
        }
    }
};

module.exports = api;