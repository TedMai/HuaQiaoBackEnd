'use strict';

angular
    .module('shadow')
    .component('shadow',{
        templateUrl: "shadow.template.html",
        controller: [
            'Shadow',
            function ShadowController(Shadow) {
                Shadow.query(
                    {},
                    function (response) {
                        console.info(response);
                    },
                    function (err) {
                        console.error(err);
                    }
                );
            }
        ]
    });