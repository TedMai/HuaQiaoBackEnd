'use strict';

angular
    .module('doctor')
    .component('doctor', {
        templateUrl: "partial/doctor/doctor.template.html",
        controller: [
            'Table', 'Container', 'FileUpload', '$scope',
            function (Table, Container, FileUpload, $scope) {
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

                        /**
                         *      排班
                         */
                        that.schedule = JSON.parse(response.schedule);
                        console.info(that.schedule);
                    },
                    function (err) {
                        console.error(err);
                    }
                );

                /**
                 * 添加批量插入功能
                 */
                this.batchInsert = function () {
                    console.info("==>   batchInsert");
                    FileUpload($scope.myFile, "/file/excel/schedule")
                        .then(
                            function (result) {
                                console.info(result);
                            }, function (error) {
                                $window.alert(error);
                            }
                        );
                };
            }
        ]
    });