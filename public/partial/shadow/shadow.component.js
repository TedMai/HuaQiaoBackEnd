'use strict';

angular
    .module('shadow')
    .component('shadow', {
        templateUrl: "partial/shadow/shadow.template.html",
        controller: [
            'Pathfinder', 'SelectHelper', 'Container', 'Cleaner', 'FileUpload', '$scope', '$location', '$window',
            function ShadowController(Pathfinder, SelectHelper, Container, Cleaner, FileUpload, $scope, $location, $window) {
                var that = this;

                /**
                 * 初始化
                 * 设置模式对话框属性值
                 */
                this.confirmModalTitle = "请您再次确认";
                this.confirmModalBody = "";
                this.confirmButtonText = "删除";
                this.cancelButtonText = "取消";
                this.targetTableName = "";
                this.targetID = "";

                /**
                 * 异步调用
                 * 获取页面初始数据
                 */
                Pathfinder.get(
                    {},
                    function (response) {
                        var i,
                            j,
                            length,
                            count;

                        console.info(response);
                        /**
                         * 返回数据
                         */
                        if (response.hasOwnProperty("hospital") && response.hospital) {
                            that.hospitals = JSON.parse(response.hospital);
                        }
                        if (response.hasOwnProperty("department") && response.department) {
                            that.departments = JSON.parse(response.department);
                            for (i = 0, length = that.departments.length; i < length; i++) {
                                for (j = 0, count = that.hospitals.length; j < count; j++) {
                                    if (that.departments[i].hospital === that.hospitals[j].hid) {
                                        that.departments[i].hospitalName = that.hospitals[j].name;
                                        break;
                                    }
                                }
                            }
                        }

                        if (response.hasOwnProperty("doctor") && response.doctor) {
                            that.doctors = JSON.parse(response.doctor);
                            for (i = 0, length = that.doctors.length; i < length; i++) {
                                for (j = 0, count = that.departments.length; j < count; j++) {
                                    if (that.doctors[i].department === that.departments[j].did) {
                                        that.doctors[i].departmentName = that.departments[j].name;
                                        break;
                                    }
                                }
                            }
                        }

                    },
                    function (err) {
                        console.error(err);
                    }
                );

                /**
                 * 预览 - 详情页
                 * @param targetUrl
                 * @param id
                 */
                this.toDetail = function (targetUrl, id) {
                    Container.set(id);
                    $window.location = targetUrl;
                };

                /**
                 * 编辑
                 * @param target
                 * @param data
                 */
                this.edit = function (target, data) {
                    console.info("==>   Edit | " + target);

                    switch (target) {
                        case 'hospital':
                            Container.set(data);
                            $window.location = '#/Edit/' + target;
                            break;
                        case 'department':
                        case 'doctor':
                            if (data.hasOwnProperty("hospitalName")) {
                                delete data.hospitalName;
                            }
                            if (data.hasOwnProperty("departmentName")) {
                                delete data.departmentName;
                            }
                            SelectHelper.superior().query(
                                {
                                    name: target
                                },
                                function (response) {
                                    console.log(response);
                                    Container.set({
                                        data: data,
                                        select: response
                                    });
                                    $window.location = '#/Edit/' + target;
                                },
                                function (error) {
                                    console.error(error);
                                }
                            );
                            break;
                        default:
                            break;
                    }
                };

                /**
                 * 删除
                 */
                this.delete = function () {
                    console.info("==>   Delete");
                    Cleaner.save(
                        {
                            name: this.targetTableName,
                            id: this.targetID
                        },
                        {},
                        function (response) {
                            console.info(response);
                            if (response.code === 0) {
                                $location.path("/");
                            } else {
                                $window.alert(response.msg.code);
                            }
                        },
                        function (error) {
                            console.error(error);
                            $window.alert(error);
                        });
                };
                /*  end of delete */

                /**
                 * 显示模式对话框
                 * @param target
                 * @param id
                 * @param hint
                 */
                this.showConfirmModal = function (target, id, hint) {
                    this.targetTableName = target;
                    this.targetID = id;
                    this.confirmModalBody = hint;
                    $('#confirmModal').modal({
                        keyboard: true,
                        show: true
                    });
                };

                /**
                 * 添加批量插入功能
                 */
                this.batchInsert = function () {
                    console.info("==>   batchInsert");
                    FileUpload($scope.myFile, "/file/excel/department")
                        .then(
                            function (result) {
                                console.info(result);
                                $location.path("/");
                            }, function (error) {
                                console.error(error);
                                $window.alert(error);
                            }
                        );
                };
                /* end of batchInsert */
            }
        ]
    });