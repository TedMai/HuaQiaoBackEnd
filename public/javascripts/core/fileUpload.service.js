'use strict';


/**
 * Service fileUpload
 */

function FileUploadService($http, $q) {
    return function (files, targetUrl) {
        var i,
            length,
            formData = new FormData(),
            deferred = $q.defer();
        console.info(files);

        for (i = 0, length = files.length; i < length; i++) {
            console.info("append file into form data");
            console.info(files[i]);
            formData.append("file", files[i]);
        }

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
                    deferred.resolve(response);
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