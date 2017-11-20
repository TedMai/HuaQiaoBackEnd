'use strict';

angular
    .module('ptHuaQiao')
    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider
        //  当URL 映射段为/Shadow 时，进入后台首页
            .when('/Shadow', {
                template: '<shadow></shadow>'
            })
            //  当URL 映射段为/Hospital 时，进入医院
            .when('/Hospital', {
                template: '<hospital></hospital>'
            })
            //  当URL 映射段为/Department 时，进入科室
            .when('/Department', {
                template: '<department></department>'
            })
            //  当URL 映射段为/Doctor 时，进入医生
            .when('/Doctor', {
                template: '<doctor></doctor>'
            })
            .when('/Edit/hospital', {
                templateUrl: "partial/create/hospital/create.hospital.template.html",
                controller: "CreateHospitalController"
                // template: '<create.hospital></create.hospital>'
            })
            .when('/Edit/department', {
                template: '<create.department></create.department>'
            })
            .when('/Edit/doctor', {
                template: '<create.doctor></create.doctor>'
            })
            //  当浏览器地址不能匹配我们任何一个路由规则时，触发重定向到/Shadow
            .otherwise({
                redirectTo: '/Shadow'
            });
    }]);