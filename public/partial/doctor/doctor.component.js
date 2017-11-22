'use strict';

angular
    .module('doctor')
    .component('doctor', {
        templateUrl: "partial/doctor/doctor.template.html",
        controller: [
            'Table',
            function (Table) {
                console.info("==>   doctor.component.js");

                Table.librarian().get(
                    // To do
                )

            }
        ]
    });