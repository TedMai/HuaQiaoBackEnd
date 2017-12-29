'use strict';

angular
    .module('create.appointment')
    .component('create.appointment', {
        templateUrl: "partial/create/appointment/create.appointment.template.html",
        controller: [
            'Table', function (Table) {
                this.createAppointment = function () {
                    console.info("createAppointment");
                    Table.repertory().save(
                        {
                            name: "appointment"
                        },
                        {
                            schedule: 3,
                            patient: 4
                        },
                        function (response) {
                            console.info(response);
                        },
                        function (error) {
                            console.error(error);
                        }
                    );
                };
            }
        ]
    });