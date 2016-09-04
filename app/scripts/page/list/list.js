'use strict';

angular.module('catiApp')
	.controller('ListCtrl', function ($scope, $rootScope) {
		const low = require('lowdb');
		db.defaults({ posts: [] }).value();
		const result = db.get('posts').push({ name: process.argv[2] }).value();
		console.log(result)
	}
);