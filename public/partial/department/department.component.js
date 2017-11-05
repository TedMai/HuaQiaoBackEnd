'use strict';

angular
    .module('department')
    .component('department', {
        templateUrl: "partial/department/department.template.html",
        controller: [
            'Container',
            function (Container) {
                console.info("department.component.js");

                var data = Container.get();
                console.info(data);

                this.department = data;
            }
        ]
    });