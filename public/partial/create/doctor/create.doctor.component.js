'use strict';

angular
    .module('create.doctor')
    .component('create.doctor', {
        templateUrl: "partial/create/doctor/create.doctor.template.html",
        controller: [
            'Container', 'Table', 'SelectHelper', 'FileUpload', 'Gallery', 'ArrayHelper', '$scope', '$location', '$window',
            function (Container, Table, SelectHelper, FileUpload, Gallery, ArrayHelper, $scope, $location, $window) {
                var
                    that = this,
                    data = Container.get();

                /**
                 * 赋值
                 */
                console.info(data);
                this.doctor = angular.copy(data.data);
                this.departmentSelect = data.select;

                /**
                 * 添加图片上传服务
                 */
                this.uploadFile = function () {
                    console.info("==>   Upload file");
                    FileUpload($scope.myFile, "/file/image")
                        .then(
                            function (result) {
                                console.info(result.paths);
                                that.album = that.album.concat(result.paths);
                                $window.alert(result.msg);
                            }, function (error) {
                                console.error(error);
                                $window.alert(error);
                            }
                        );
                };
                /**
                 * 图片预览
                 */
                if (typeof(this.doctor.id) === "undefined") {
                    // 新增
                    this.album = [];
                } else {
                    // 编辑
                    // 取数
                    Gallery.temp().get(
                        {
                            type: 2,
                            id: this.doctor.id
                        },
                        {},
                        function (response) {
                            console.info(response);
                            if(response.code === 0) {
                                that.album = angular.copy(response.paths);
                            }else{
                                that.album = [];
                            }
                        },
                        function (error) {
                            console.error(error);
                            that.album = [];
                        }
                    );

                    // 返回图集（含图片链接） - 赋值
                }
                /**
                 * 删除图片
                 */
                this.deleteFile = function (file) {
                    this.album.remove(file);
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

                    Table.repertory().save(
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