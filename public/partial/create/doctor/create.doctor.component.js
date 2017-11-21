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
                console.info(data);
                this.doctor = angular.copy(data.data);
                this.departmentSelect = data.select;
                this.album = [];
                /**
                 * 添加图片上传服务
                 */
                this.uploadFile = function () {
                    console.info("==>   Upload file");
                    FileUpload($scope.myFile, "/upload")
                        .then(
                            function (result) {
                                console.info(result.paths);
                                that.album = result.paths;
                                $window.alert(result.msg);
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
                    var i,
                        length,
                        gallery = [];

                    console.info("==>   Save");
                    for (i = 0, length = this.album.length; i < length; i++) {
                        gallery.push({
                            imageurl: this.album[i],
                            type: 2,
                            relative: typeof(this.doctor.id) === "undefined" ? 0 : this.doctor.id
                        });
                    }
                    console.info(gallery);
                    console.info(this.doctor);

                    Table.save(
                        {
                            name: name,
                            id: this.doctor.id
                        },
                        {
                            information: this.doctor,
                            gallery: gallery
                        },
                        function (response) {
                            console.log(response);
                            if (response.code === 0) {
                                $window.alert("保存成功");
                            } else {
                                $window.alert(response.msg.code);
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