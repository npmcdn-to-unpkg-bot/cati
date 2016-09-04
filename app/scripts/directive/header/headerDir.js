'use strict';

angular.module("catiApp")
	.directive("headerDir", function ($rootScope, $filter, $timeout) {
		return {
			link: function (scope, element, attrs) {
				
			},
			replace: true,
			scope:{
			},
			restrict:"EA",
			templateUrl: 'views/directive/header/headerDir.html'
		};
	});