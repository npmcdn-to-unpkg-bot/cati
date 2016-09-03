'use strict';

angular.module('catiApp')
	.config(function ($httpProvider, $stateProvider, $urlRouterProvider, $resourceProvider, $compileProvider) {

		$httpProvider.defaults.xsrfCookieName = 'csrftoken';
		$httpProvider.defaults.xsrfHeaderName = 'X-CSRFToken';
		$resourceProvider.defaults.stripTrailingSlashes = false;
		$compileProvider.imgSrcSanitizationWhitelist(/^\s*(https?|local|data|chrome-extension):/);

		$stateProvider
			.state('list', {
				url: '/:framework',
				templateUrl: 'views/list/list.html',
				controller: 'ListCtrl'
			})
			.state('detail', {
				url: '/:framework',
				templateUrl: 'views/detail/detail.html',
				controller: 'DetailCtrl'
			});
		
		$urlRouterProvider.otherwise('list');
	});