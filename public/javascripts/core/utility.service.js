'use strict';

angular
    .module('utility.core')
    .factory('ArrayHelper',
        function () {
            return new ArrayHelperService();
        }
    );

function ArrayHelperService() {
    Array.prototype.indexOf = function (attr, val) {
        for (var i = 0; i < this.length; i++) {
            if (this[i][attr] === val)
                return i;
        }
        return -1;
    };
    Array.prototype.remove = function (attr, val) {
        var index = this.indexOf(attr, val);
        console.info("Array.prototype.remove ==> remove item: " + index);
        if (index > -1) {
            this.splice(index, 1);
        }
    };
}