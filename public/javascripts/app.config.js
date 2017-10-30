'use strict';

angular
    .module('ptHuaQiao')
    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider
            //  当URL 映射段为/Shadow 时，进入后台
            .when('/Shadow', {
                template: '<shadow></shadow>'
            })
            //  当浏览器地址不能匹配我们任何一个路由规则时，触发重定向到/Hospital
            .otherwise({
                redirectTo: '/Shadow'
            });
    }]);