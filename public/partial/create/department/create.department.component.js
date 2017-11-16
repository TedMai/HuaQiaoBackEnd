'use strict';

angular
    .module('create.department')
    .component('create.department', {
        templateUrl: "partial/create/department/create.department.template.html",
        controller: [
            'Container', 'Table', 'SelectHelper', 'FileUpload', '$scope', '$location', '$window',
            function (Container, Table, SelectHelper, FileUpload, $scope, $location, $window) {
                console.log("==>    create.department.component.js");

                var
                    that = this,
                    data = Container.get();

                /**
                 * 赋值
                 */
                this.department = data.data;
                this.hospitalSelect = data.select;

                /**
                 * 添加图片上传服务
                 */
                this.uploadFile = function () {
                    console.info("==>   Upload file");
                    FileUpload($scope.myFile, "/upload")
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
                            id: this.department.did
                        },
                        {
                            information: this.department,
                            gallery: {
                                imageurl: this.relativeImageUrl,
                                type: 1,
                                relative: 0
                            }
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