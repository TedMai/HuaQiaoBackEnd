'use strict';

angular
    .module('fileReader.core')
    .directive('fileModel', ['$parse', function ($parse) {
        console.info("fileReader.directive.js ==> load file-model");
        return {
            restrict: 'A',
            link: function (scope, element, attrs) {
                console.info("fileReader.directive.js ==> directive");

                var model = $parse(attrs.fileModel);
                var modelSetter = model.assign;
                console.info(scope);
                console.info(element);
                console.info(attrs);

                element.bind('change', function (event) {
                    console.info("fileReader.directive.js ==> !!! directive changed !!!");
                    console.info(event);
                    console.info(element[0].files[0]);

                    scope.$apply(function () {
                        modelSetter(scope, element[0].files[0]);
                    });
                    // attachment
                    // scope.file = (event.srcElement || event.target).files[0];

                });
            }
        };
    }]);