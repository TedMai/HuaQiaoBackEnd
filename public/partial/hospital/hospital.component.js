'use strict';

angular
    .module('hospital')
    .component('hospital', {
        templateUrl: "partial/hospital/hospital.template.html",
        controller: [
            'Container',
            function (Container) {
                console.info("hospital.component.js");

                var data = Container.get();
                console.info(data);

                this.hospital = data;
            }
        ]
    });