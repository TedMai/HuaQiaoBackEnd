'use strict';

angular
    .module('doctor')
    .component('doctor', {
        templateUrl: "partial/doctor/doctor.template.html",
        controller: [
            'Container',
            function (Container) {
                console.info("doctor.component.js");

                var data = Container.get();
                console.info(data);

                this.doctor = data;
            }
        ]
    });