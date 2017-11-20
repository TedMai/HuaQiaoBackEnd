'use strict';

angular
    .module('create.hospital')
    .controller('CreateHospitalController', [
            'Container', 'Table', 'FileUpload', '$scope', '$location', '$window',
            function (Container, Table, FileUpload, $scope, $location, $window) {
                var
                    that = this,
                    data = Container.get();

                /**
                 * 赋值
                 */
                $scope.hospital = angular.copy(data);
                $scope.album = [];
                $scope.hospitalGallery = [
                    "file/" + encodeURIComponent("20171116\\20171116115625799584_56ceb1103bda6.jpg"),
                    "file/" + encodeURIComponent("20171116\\20171116115625800561_56ceb1389bfef.jpg"),
                    "file/" + encodeURIComponent("20171116\\20171116115625801649_56ceb1512abaf.jpg")
                ];

                /**
                 * 时间转化为Date对象
                 */
                if (data.hasOwnProperty("founding")) {
                    $scope.hospital.founding = new Date(data.founding);
                }

                /**
                 * 添加图片上传服务
                 */
                $scope.uploadFile = function () {
                    console.info("==>   Upload file");
                    FileUpload($scope.myFile, "/upload")
                        .then(
                            function (result) {
                                console.info(result.paths);
                                $scope.album = result.paths;
                                $window.alert(result.msg);
                            }, function (error) {
                                console.error(error);
                                $window.alert(error);
                            }
                        );
                };

                /**
                 * 保存事件响应
                 */
                $scope.save = function (name) {
                    var i,
                        length,
                        gallery = [];

                    console.info("==>   Save");
                    for (i = 0, length = $scope.album.length; i < length; i++) {
                        gallery.push({
                            imageurl: $scope.album[i],
                            type: 0,
                            relative: typeof($scope.hospital.hid) === "undefined" ? 0 : $scope.hospital.hid
                        });
                    }
                    console.info(gallery);

                    Table.save(
                        {
                            name: name,
                            id: $scope.hospital.hid
                        },
                        {
                            information: {
                                hid: $scope.hospital.hid,
                                name: $scope.hospital.name,
                                description: $scope.hospital.description,
                                founding: $scope.hospital.founding,
                                address: $scope.hospital.address,
                                contact: $scope.hospital.contact,
                                axisX: $scope.hospital.axisX,
                                axisY: $scope.hospital.axisY
                            },
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
    );