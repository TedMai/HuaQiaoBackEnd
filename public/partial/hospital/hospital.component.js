'use strict';

angular
    .module('hospital')
    .component('hospital', {
        templateUrl: "partial/hospital/hospital.template.html",
        controller: [
            'Table',
            function (Table) {
                console.info("==>   hospital.component.js");

                Table.librarian().get(
                    // To do
                )
            }
        ]
    });