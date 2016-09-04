'use strict';

angular.module("catiApp")
	.directive("scrollerDir", function ($rootScope, $filter, $timeout) {
		return {
			link: function (scope, element, attrs) {
				
			},
			replace: true,
			scope:{
			},
			restrict:"EA",
			templateUrl: 'views/scroller/scrollerDir.html'
		};
	});