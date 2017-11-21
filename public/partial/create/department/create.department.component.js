'use strict';

angular
    .module('create.department')
    .component('create.department', {
        templateUrl: "partial/create/department/create.department.template.html",
        controller: [
            'Container', 'Table', 'SelectHelper', 'FileUpload', '$scope', '$location', '$window',
            function (Container, Table, SelectHelper, FileUpload, $scope, $location, $window) {
                var
                    that = this,
                    data = Container.get();

                /**
                 * 赋值
                 */
                this.department = data.data;
                this.hospitalSelect = data.select;
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
                            type: 1,
                            relative: typeof(this.department.did) === "undefined" ? 0 : this.department.did
                        });
                    }
                    console.info(gallery);
                    console.info(this.department);

                    Table.save(
                        {
                            name: name,
                            id: this.department.did
                        },
                        {
                            information: this.department,
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