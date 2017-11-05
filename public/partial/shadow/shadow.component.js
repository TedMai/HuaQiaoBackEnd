'use strict';

angular
    .module('shadow')
    .component('shadow', {
        templateUrl: "partial/shadow/shadow.template.html",
        controller: [
            'Pathfinder', 'Container', '$window',
            function ShadowController(Pathfinder, Container, $window) {
                var that = this;

                Pathfinder.get(
                    {},
                    function (response) {
                        /**
                         * 数据
                         */
                        if (response.hasOwnProperty("hospital") && response.hospital) {
                            that.hospitals = JSON.parse(response.hospital);
                        }
                        if (response.hasOwnProperty("department") && response.department) {
                            that.departments = JSON.parse(response.department);
                        }
                        if (response.hasOwnProperty("doctor") && response.doctor) {
                            that.doctors = JSON.parse(response.doctor);
                        }

                    },
                    function (err) {
                        console.error(err);
                    }
                );

                this.toDetail = function (targetUrl, data) {
                    Container.set(data);
                    $window.location = targetUrl;
                };

                this.edit = function (target, data) {
                    console.info("==>   Edit | " + target)
                    Container.set(data);
                    $window.location = '#/Edit/' + target;
                }
            }
        ]
    });