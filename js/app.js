'use strict';


// Declare app level module which depends on filters, and services
angular.module('myApp', ['myApp.directives'])
    .controller('PasteController', ['$scope', function ($scope) {
    $scope.rawPaste = '';
    $scope.parsedPaste = [];
}]);
