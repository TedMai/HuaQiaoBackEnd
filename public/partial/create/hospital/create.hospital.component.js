// 'use strict';

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
                this.hospitalGallery = [
                    "file/" + encodeURIComponent("20171116\\20171116115625799584_56ceb1103bda6.jpg"),
                    "file/" + encodeURIComponent("20171116\\20171116115625800561_56ceb1389bfef.jpg"),
                    "file/" + encodeURIComponent("20171116\\20171116115625801649_56ceb1512abaf.jpg")
                ];
                this.testData = "ok";

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
                 * 保存事件响应
                 */
                this.save = function (name) {
                    var i,
                        length,
                        gallery = [];

                    console.info("==>   Save");
                    for (i = 0, length = this.album.length; i < length; i++) {
                        gallery.push({
                            imageurl: this.album[i],
                            type: 0,
                            relative: typeof(this.hospital.hid) === "undefined" ? 0 : this.hospital.hid
                        });
                    }
                    console.info(gallery);

                    Table.save(
                        {
                            name: name,
                            id: this.hospital.hid
                        },
                        {
                            information: {
                                hid: this.hospital.hid,
                                name: this.hospital.name,
                                description: this.hospital.description,
                                founding: this.hospital.founding,
                                address: this.hospital.address,
                                contact: this.hospital.contact,
                                axisX: this.hospital.axisX,
                                axisY: this.hospital.axisY
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
    });