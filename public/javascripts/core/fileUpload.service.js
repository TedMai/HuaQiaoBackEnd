'use strict';

/**
 * Service fileUpload
 *
 */
angular
    .module('fileUpload.core')
    .factory('FileUpload', [
        '$http',
        function ($http) {
            this.uploadFileToUrl = function (file, targetUrl) {
                var formData = new FormData();
                formData.append("file", file);

                $http.post(
                    targetUrl,
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
                    })
            }
        }]
    );