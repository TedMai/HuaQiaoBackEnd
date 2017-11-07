'use strict';

angular
    .module('fileReader.core')
    .directive('fileModel', ['$parse', function ($parse) {
        console.info("fileReader.directive.js ==> load file-model");
        return {
            restrict: 'A',
            link: function (scope, element, attrs) {
                var model = $parse(attrs.fileModel);
                var modelSetter = model.assign;

                element.bind('change', function (event) {
                    console.info("fileReader.directive.js ==> !!! directive changed !!!");

                    scope.$apply(function () {
                        modelSetter(scope, element[0].files[0]);
                    });
                });
            }
        };
    }]);