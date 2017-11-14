'use strict';

angular
    .module('create.hospital')
    .component('create.hospital', {
        templateUrl: "partial/create/hospital/create.hospital.template.html",
        controller: [
            'Container', 'Table', 'FileUpload', '$scope', '$location', '$window',
            function (Container, Table, FileUpload, $scope, $location, $window) {
                var
                    that = this,
                    data = Container.get();

                /**
                 * 赋值
                 */
                this.hospital = data;

                /**
                 * 时间转化为Date对象
                 */
                if (data.hasOwnProperty("founding")) {
                    this.hospital.founding = new Date(data.founding);
                }

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
                 * 保存事件响应
                 */
                this.save = function (name) {
                    console.info("==>   Save");
                    Table.save(
                        {
                            name: name,
                            id: this.hospital.hid
                        },
                        {
                            information: this.hospital,
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