'use strict';

angular
    .module('create')
    .component('create', {
        templateUrl: "partial/create/create.template.html",
        controller: [
            'Container', 'Table', 'FileUpload', '$location', '$scope', '$window',
            function (Container, Table, FileUpload, $location, $scope, $window) {
                var
                    that = this,
                    data = Container.get();
                /**
                 * 赋值
                 */
                switch ($location.path()) {
                    case '/Edit/Hospital':
                        this.showHospital = true;
                        this.hospital = data;
                        /**
                         * 时间转化为Date对象
                         */
                        if (data.hasOwnProperty("founding")) {
                            this.hospital.founding = new Date(data.founding);
                        }
                        break;
                    case '/Edit/Department':
                        this.showDepartment = true;
                        this.department = data;
                        break;
                    case '/Edit/Doctor':
                        this.showDoctor = true;
                        this.doctor = data;
                        break;
                    default:
                        break;
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
                 * 保存
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