'use strict';

angular.module('tuti')
	.config(function ($httpProvider, $stateProvider, $urlRouterProvider, $resourceProvider, $compileProvider) {

		$httpProvider.defaults.xsrfCookieName = 'csrftoken';
		$httpProvider.defaults.xsrfHeaderName = 'X-CSRFToken';
		$resourceProvider.defaults.stripTrailingSlashes = false;
		$compileProvider.imgSrcSanitizationWhitelist(/^\s*(https?|local|data|chrome-extension):/);

		$stateProvider
			.state('list', {
				url: '/:framework',
				templateUrl: 'views/page/list/list.html',
				controller: 'ListCtrl'
			})
			.state('detail', {
				url: '/:framework',
				templateUrl: 'views/page/detail/detail.html',
				controller: 'DetailCtrl'
			});
		
		$urlRouterProvider.otherwise('list');
	});