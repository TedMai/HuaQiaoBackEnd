'use strict';

angular
    .module('hospital')
    .component('hospital', {
        templateUrl: "partial/hospital/hospital.template.html",
        controller: [
            'Table', 'Container',
            function (Table, Container) {
                var that = this,
                    hospital = {},
                    gallery = {},
                    focusImage,
                    data = Container.get();

                console.info("==>   hospital.component.js");
                Table.librarian().get(
                    {
                        id: data
                    },
                    {},
                    function (response) {
                        if (response.code === 0) {
                            /**
                             *      基本信息
                             */
                            that.hospital = JSON.parse(response.msg.hospital)[0];
                            console.info(that.hospital);

                            /**
                             *      图集
                             */
                            that.gallery = JSON.parse(response.msg.gallery);
                            console.info(that.gallery);
                            (that.gallery.length > 0) && (that.focusImage = 'file/image/screenshot/' + that.gallery[0].imageurl);
                        }
                    },
                    function (err) {
                        console.error(err);
                    }
                )
            }
        ]
    });