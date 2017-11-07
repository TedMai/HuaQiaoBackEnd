'use strict';


/**
 * Service fileUpload
 */

function FileUploadService($http, $q) {
    return function (file, targetUrl) {
        var formData = new FormData(),
            deferred = $q.defer();

        formData.append("file", file);
        $http.post(
            targetUrl,
            formData,
            {
                transformRequest: angular.identity,
                headers: {"Content-Type": undefined}
            })
            .success(function (response) {
                console.info(response);
                if (response.code === 0) {
                    deferred.resolve(response.path);
                } else {
                    deferred.reject(response.msg);
                }
            })
            .error(function (error) {
                deferred.reject(error);
            });

        return deferred.promise;
    }
}

angular
    .module('fileUpload.core')
    .factory('FileUpload', [
        '$http', '$q',
        function ($http, $q) {
            return new FileUploadService($http, $q);
        }]
    );