'use strict';

angular
    .module('doctor')
    .component('doctor', {
        templateUrl: "partial/doctor/doctor.template.html",
        controller: [
            'Table', 'Container',
            function (Table, Container) {
                var that = this,
                    data = Container.get();

                console.info("==>   doctor.component.js");
                Table.librarian().get(
                    {
                        id: data.id,
                        name: 'doctor'
                    },
                    {},
                    function (response) {
                        console.info("==>   doctor.component.js     ==>  Response:");
                        /**
                         *      基本信息
                         */
                        that.doctor = JSON.parse(response.doctor)[0];
                        console.info(that.doctor);

                        /**
                         *      图集
                         */
                        that.gallery = JSON.parse(response.gallery);
                        console.info(that.gallery);
                        (that.gallery.length > 0) && (that.focusImage = 'backbone/image/screenshot/' + that.gallery[0].imageurl);

                    },
                    function (err) {
                        console.error(err);
                    }
                )
            }
        ]
    });