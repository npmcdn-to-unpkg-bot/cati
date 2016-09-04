'use strict';

angular.module("tuti")
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