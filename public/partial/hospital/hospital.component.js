'use strict';

angular
    .module('hospital')
    .component('hospital', {
        templateUrl: "partial/hospital/hospital.template.html",
        controller: [
            'Table', 'Container',
            function (Table, Container) {
                var that = this,
                    data = Container.get();

                console.info("==>   hospital.component.js");
                Table.librarian().get(
                    {
                        id: data.hid,
                        name: 'hospital'
                    },
                    {},
                    function (response) {
                            /**
                             *      基本信息
                             */
                            that.hospital = JSON.parse(response.hospital)[0];
                            console.info(that.hospital);

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