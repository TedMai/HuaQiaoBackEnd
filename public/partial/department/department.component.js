'use strict';

angular
    .module('department')
    .component('department', {
        templateUrl: "partial/department/department.template.html",
        controller: [
            'Table', 'Container',
            function (Table, Container) {
                console.info("==>   department.component.js");

                Table.librarian().get(
                    // To do
                )
            }
        ]
    });