'use strict';

/**
 * Service Reader
 *  - 生成获取到的文件的url地址，返回到view进行预览
 */
angular
    .module('reader.core')
    .factory('Reader', [
        '$q',
        function ($q) {
            var onLoad = function (reader, deferred, scope) {
                console.info("1 ==> onLoad");
                return function () {
                    scope.apply(function () {
                        deferred.resolve(reader.result);
                    });
                }
            };

            var onError = function (reader, deferred, scope) {
                console.info("2 ==> onError");
                return function () {
                    scope.apply(function () {
                        deferred.reject(reader.result);
                    });
                }
            };

            var getReader = function (deferred, scope) {
                console.info("3 ==> getReader");
                var reader = new FileReader();
                reader.onload = onLoad(reader, deferred, scope);
                reader.onerror = onError(reader, deferred, scope);
                return reader;
            };

            var readAsDataUrl = function (file, scope) {
                console.info("4 ==> readAsDataUrl");
                var deferred = $q.defer();
                var reader = getReader(deferred, scope);
                reader.readAsDataURL(file);
                return deferred.promise;
            };

            return {
                readAsDataUrl: readAsDataUrl
            };
        }]
    );