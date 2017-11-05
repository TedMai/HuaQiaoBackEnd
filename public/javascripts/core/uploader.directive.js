'use strict';

angular
    .module('uploader.core')
    .directive('fileModel', ['$parse', function ($parse) {
        console.info("uploader.directive.js ==> load file-model");
        return {
            restrict: 'A',
            link: function (scope, element, attrs) {
                console.info("uploader.directive.js ==> directive");

                var model = $parse(attrs.fileModel);
                var modelSetter = model.assign;
                console.info(scope);
                console.info(element);
                console.info(attrs);

                console.info(attrs.fileModel);
                console.info(model);
                console.info(modelSetter);

                element.bind('change', function (event) {
                    console.info("uploader.directive.js ==> !!! directive changed !!!");
                    console.info(event);
                    console.info(element[0].files[0]);

                    scope.$apply(function () {
                        modelSetter(scope, element[0].files[0]);
                    });
                    // attachment
                    scope.file = (event.srcElement || event.target).files[0];

                });
            }
        };
    }])
    .directive('myDarling', function () {
        console.info("uploader.directive.js ==> my-darling");
        return {
            restrict: 'EA',
            scope: false,
            template: '<div>take a look:{{name}} <input ng-model="name"/></div>'
        };
    });