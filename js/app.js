'use strict';


// Declare app level module which depends on filters, and services
angular.module('myApp', ['myApp.directives'])
    .controller('PasteController', ['$scope', function ($scope) {

    $scope.rawPaste = '';
    $scope.parsedPaste = [];

	var MyStrategy = function() {

	    this.pattern = function() {	    
	    	console.log("my pattern")
	        return /[\n\f\r]/;
	    };

	    this.action = function(item, $scope){

    		return item.split("\t")[0];
	    }

	    this.finish = function(item, $scope){
	    	console.log("finish", item);

	    }
	};

    $scope.StrategyA = function(){
    	return new MyStrategy();
    };

}]);
