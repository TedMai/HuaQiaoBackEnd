'use strict';

angular
    .module('department')
    .component('department', {
        templateUrl: "partial/department/department.template.html",
        controller: [
            'Table',
            function (Table) {
                console.info("==>   department.component.js");

                Table.librarian().get(
                    // To do
                )
            }
        ]
    });