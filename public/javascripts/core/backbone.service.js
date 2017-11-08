'use strict';

angular
    .module('backbone.core')
    .factory('Pathfinder', ['$resource',
        function ($resource) {
            return $resource('/backbone', {}, {});
        }
    ])
    .factory('Table', ['$resource',
        function ($resource) {
            return $resource("/backbone/table/:name", {name: '@name'}, {});
        }
    ])
    .factory('Cleaner', ['$resource',
        function ($resource) {
            return $resource("/backbone/table/:name/id/:id", {name: '@name', id: '@id'}, {});
        }
    ])
    .factory('Container', function () {
        /**
         * define parameter object
         * @type {{}}
         */
        var myHospital = {};

        /**
         * set data to parameters
         * @param data
         * @private
         */
        var _setter = function (data) {
            console.info("Container     ==>     _setter");
            myHospital = data;
        };

        /**
         * get parameters
         * @returns {{}}
         * @private
         */
        var _getter = function () {
            console.info("Container     ==>     _getter");
            return myHospital;
        };

        return {
            set: _setter,
            get: _getter
        }
    })
;