'use strict';

angular
    .module('shadow')
    .component('shadow', {
        templateUrl: "partial/shadow/shadow.template.html",
        controller: [
            'Pathfinder', 'SelectHelper', 'Container', 'Cleaner', 'ArrayHelper', '$window',
            function ShadowController(Pathfinder, SelectHelper, Container, Cleaner, ArrayHelper, $window) {
                var that = this;

                Pathfinder.get(
                    {},
                    function (response) {
                        var i,
                            j,
                            length,
                            count;

                        /**
                         * 数据
                         */
                        if (response.hasOwnProperty("hospital") && response.hospital) {
                            that.hospitals = JSON.parse(response.hospital);
                        }
                        if (response.hasOwnProperty("department") && response.department) {
                            that.departments = JSON.parse(response.department);
                            for (i = 0, length = that.departments.length; i < length; i++) {
                                for (j = 0, count = that.hospitals.length; j < count; j++) {
                                    if (that.departments[i].hospital === that.hospitals[j].hid) {
                                        that.departments[i].hospitalName = that.hospitals[j].name;
                                        break;
                                    }
                                }
                            }
                        }

                        if (response.hasOwnProperty("doctor") && response.doctor) {
                            that.doctors = JSON.parse(response.doctor);
                            for (i = 0, length = that.doctors.length; i < length; i++) {
                                for (j = 0, count = that.departments.length; j < count; j++) {
                                    if (that.doctors[i].department === that.departments[j].did) {
                                        that.doctors[i].departmentName = that.departments[j].name;
                                        break;
                                    }
                                }
                            }
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

                    switch (target) {
                        case 'hospital':
                            Container.set(data);
                            $window.location = '#/Edit/' + target;
                            break;
                        case 'department':
                        case 'doctor':
                            SelectHelper.get(
                                {
                                    name: target
                                },
                                function (response) {
                                    console.log(response);
                                    if (response.code === 0) {
                                        Container.set({
                                            data: data,
                                            select: response.msg
                                        });
                                        $window.location = '#/Edit/' + target;
                                    }
                                },
                                function (error) {
                                    console.error(error);
                                }
                            );
                            break;
                        default:
                            break;
                    }
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
                                switch (target) {
                                    case 'hospital':
                                        that.hospitals.remove("hid", id);
                                        break;
                                    case 'department':
                                        that.departments.remove("did", id);
                                        break;
                                    case 'doctor':
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
                            $window.alert(error);
                        });
                }
            }
        ]
    });