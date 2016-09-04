'use strict';

angular.module("tuti")
	.directive("itemDir", function ($rootScope, $filter, $timeout) {
		return {
			link: function (scope, element, attrs) {
				
			},
			replace: true,
			scope:{
			},
			restrict:"EA",
			templateUrl: 'views/item/itemDir.html'
		};
	});