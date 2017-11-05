'use strict';

angular
    .module('create')
    .component('create', {
        templateUrl: "partial/create/create.template.html",
        controller: [
            'Container', 'Reader', '$location', '$scope',
            function (Container, Reader, $location, $scope) {
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
                this.getFile = function () {
                    console.info("==> Get file");
                    console.info(this.file);
                    console.info($scope);
                    Reader
                        .readAsDataUrl($scope.file, this)
                        .then(function (result) {
                            console.info("readAsDataUrl ==> " + result);
                            that.hospitalImageUrl = result;
                        })
                };
            }
        ]
    });