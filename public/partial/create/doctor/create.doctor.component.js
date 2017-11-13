'use strict';

angular
    .module('create.doctor')
    .component('create.doctor', {
        templateUrl: "partial/create/doctor/create.doctor.template.html",
        controller: [
            'Container', 'Table', 'SelectHelper', 'FileUpload', '$scope', '$location', '$window',
            function (Container, Table, SelectHelper, FileUpload, $scope, $location, $window) {
                var
                    that = this,
                    data = Container.get();

                /**
                 * 赋值
                 */
                this.doctor = data.data;
                this.departmentSelect = data.select;
                /**
                 * 添加图片上传服务
                 */
                this.uploadFile = function () {
                    console.info("==>   Upload file");
                    FileUpload($scope.myFile, "/image")
                        .then(
                            function (result) {
                                console.info(result);
                                that.relativeImageUrl = result;
                            }, function (error) {
                                console.error(error);
                                $window.alert(error);
                            }
                        );
                };

                /**
                 * 保存
                 */
                this.save = function (name) {
                    console.info("==>   Save");

                    Table.save(
                        {
                            name: name,
                            id: this.doctor.id
                        },
                        {
                            information: this.doctor,
                            gallery: {
                                imageurl: this.relativeImageUrl,
                                type: 0,
                                relative: 0
                            }
                        },
                        function (response) {
                            console.log(response);
                            if (response.code === 0) {
                                $window.alert("保存成功");
                            } else {
                                $window.alert(response.msg);
                            }
                            $location.path("/");
                        },
                        function (error) {
                            console.error(error);
                            $location.path("/");
                        }
                    );
                };
                /** end of save **/

            }   /** end of controller **/
        ]
    });