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
            /**
             * 新增 | 编辑
             * @returns {*}
             * @private
             */
            var _repertory = function () {
                return $resource("/backbone/table/:name", {name: '@name'}, {});
            };

            /**
             * 取数 - 指定表格指定记录
             * @returns {*}
             * @private
             */
            var _fetch = function () {
                return $resource("/backbone/table/:name/id/:id", {name: '@name', id: '@id'}, {});
            };

            var _batch = function () {

            };

            return {
                repertory: _repertory,
                librarian: _fetch
            }
        }
    ])
    .factory('Cleaner', ['$resource',
        function ($resource) {
            return $resource("/backbone/table/:name/id/:id", {name: '@name', id: '@id'}, {});
        }
    ])
    .factory('SelectHelper', ['$resource',
        function ($resource) {
            return $resource('/backbone/select/:name', {name: '@name'}, {});
        }
    ])
    .factory("Gallery", ['$resource', function ($resource) {
        /**
         * temp文件夹下的图像文件列表
         * @returns {*}
         * @private
         */
        var _temp = function () {
            return $resource('/file/temp/:type/:id', {}, {});
        };

        /**
         * 删除目标文件夹下的指定文件
         * @returns {*}
         * @private
         */
        var _remove = function () {
            return $resource('/file/remove/:root/:path', {}, {});
        };

        return {
            temp: _temp,
            remove: _remove
        }
    }])
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