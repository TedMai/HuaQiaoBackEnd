'use strict';

angular
    .module('create.hospital')
    .controller('CreateHospitalController', [
            'Container', 'Table', 'FileUpload', 'Gallery', 'ArrayHelper', '$scope', '$location', '$window',
            function (Container, Table, FileUpload, Gallery, ArrayHelper, $scope, $location, $window) {
                var
                    that = this,
                    data = Container.get();

                /**
                 * 赋值
                 */
                $scope.hospital = angular.copy(data);

                /**
                 * 时间转化为Date对象
                 */
                if (data.hasOwnProperty("founding")) {
                    $scope.hospital.founding = new Date(data.founding);
                }
                /**
                 * 图片预览
                 */
                if (typeof($scope.hospital.hid) === "undefined") {
                    // 新增
                    $scope.album = [];
                } else {
                    // 编辑
                    // 取数
                    // - 根据hid在数据库找到对应的图片链接地址
                    // - 将医院图片复制至temp文件夹
                    Gallery.temp().get(
                        {
                            type: 0,
                            id: $scope.hospital.hid
                        },
                        {},
                        function (response) {
                            console.info(response);
                            if(response.code === 0) {
                                $scope.album = angular.copy(response.paths);
                            }else{
                                $scope.album = [];
                            }
                        },
                        function (error) {
                            console.error(error);
                            $scope.album = [];
                        }
                    );

                    // 返回图集（含图片链接） - 赋值
                }
                /**
                 * 添加图片上传服务
                 */
                $scope.uploadFile = function () {
                    console.info("==>   Upload file");
                    FileUpload($scope.myFile, "/file/image")
                        .then(
                            function (result) {
                                console.info(result.paths);
                                $scope.album = $scope.album.concat(result.paths);
                                $window.alert(result.msg);
                            }, function (error) {
                                console.error(error);
                                $window.alert(error);
                            }
                        );
                };
                /**
                 * 删除图片
                 */
                $scope.deleteFile = function (file) {
                    $scope.album.remove(file);
                    Gallery.remove().save(
                        {
                            root: "temp",
                            path: file
                        },
                        {},
                        function (response) {
                            console.info(response);
                        },
                        function (err) {
                            console.error(err);
                        }
                    )
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

                    Table.repertory().save(
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