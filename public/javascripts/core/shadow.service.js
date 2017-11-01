'use strict';

angular
    .module('shadow.core')
    .factory('Shadow', ['$resource',
        function ($resource) {
            return $resource('/doctor', {}, {});
        }
    ]);