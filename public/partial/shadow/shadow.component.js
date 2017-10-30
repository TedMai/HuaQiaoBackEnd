'use strict';

angular
    .module('shadow')
    .component('shadow', {
        templateUrl: "partial/shadow/shadow.template.html",
        controller: [
            'Shadow',
            function ShadowController(Shadow) {
                var that =  this;

                Shadow.query(
                    {},
                    function (response) {

                        var i,
                            length;

                        for (i = 0, length = response.length; i < length; i++) {
                            console.info(response[i]);
                        }

                        that.doctors = response;

                    },
                    function (err) {
                        console.error(err);
                    }
                );
            }
        ]
    });