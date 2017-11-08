'use strict';

angular
    .module('shadow')
    .component('shadow', {
        templateUrl: "partial/shadow/shadow.template.html",
        controller: [
            'Pathfinder', 'Container', 'Cleaner', 'ArrayHelper', '$window',
            function ShadowController(Pathfinder, Container, Cleaner, ArrayHelper, $window) {
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
                    console.info("==>   Edit | " + target);
                    Container.set(data);
                    $window.location = '#/Edit/' + target;
                };

                this.delete = function (target, id) {
                    console.info("==>   Delete");

                    Cleaner.save(
                        {
                            name: target,
                            id: id
                        },
                        {},
                        function (response) {
                            console.info(response);
                            if (response.code === 0) {
                                switch(target){
                                    case 'Hospital':
                                        that.hospitals.remove("hid", id);
                                        break;
                                    case 'Department':
                                        that.departments.remove("did", id);
                                        break;
                                    case 'Doctor':
                                        that.doctors.remove("id", id);
                                        break;
                                    default:
                                        break;
                                }

                            } else {
                                $window.alert(response.msg);
                            }
                        },
                        function (error) {
                            console.error(error);
                        });
                }
            }
        ]
    });