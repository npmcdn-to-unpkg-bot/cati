'use strict';

angular.module("catiApp")
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