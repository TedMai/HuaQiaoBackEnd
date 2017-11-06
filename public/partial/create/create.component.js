'use strict';

angular
    .module('create')
    .component('create', {
        templateUrl: "partial/create/create.template.html",
        controller: [
            'Container', '$location', '$scope', '$http',
            function (Container, $location, $scope, $http) {
                var
                    that = this,
                    data = Container.get();
                /**
                 * 赋值
                 */
                switch ($location.path()) {
                    case '/Edit/Hospital':
                        this.showHospital = true;
                        Date.prototype.Format = function (fmt) { //author: meizz
                            var o = {
                                "M+": this.getMonth() + 1, //月份
                                "d+": this.getDate(), //日
                                "h+": this.getHours(), //小时
                                "m+": this.getMinutes(), //分
                                "s+": this.getSeconds(), //秒
                                "q+": Math.floor((this.getMonth() + 3) / 3), //季度
                                "S": this.getMilliseconds() //毫秒
                            };
                            if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
                            for (var k in o)
                                if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
                            return fmt;
                        };
                        console.info(new Date(data.founding).Format("yyyy-MM-dd"));
                        this.hospital = data;
                        this.hospital.founding = new Date(data.founding).Format("yyyy-MM-dd");
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
                 * 加载阅读器
                 */
                this.uploadFile = function () {
                    console.info("==> Upload file");
                    console.info(this.file);
                    console.info($scope);

                    var formData = new FormData();
                    formData.append("file", $scope.file);

                    $http.post(
                        "/image",
                        formData,
                        {
                            transformRequest: angular.identity,
                            headers: {"Content-Type": undefined}
                        })
                        .success(function (response) {
                            console.info("success");
                            console.info(response);
                        })
                        .error(function (error) {
                            console.info("fail");
                            console.error(error);
                        });

                    // FileUpload
                    //     .uploadFileToUrl($scope.file, "");

                };
            }
        ]
    });