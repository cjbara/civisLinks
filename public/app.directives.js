angular.module('app.directives', [])

.directive('config', function() {
	return {
		restrict: 'E',
		templateUrl: 'views/config.html'
	};
})

.directive('navbar', function() {
	return {
		restrict: 'E',
		templateUrl: 'views/navbar.html'
	};
})

.directive('showLinks', function() {
	return {
		restrict: 'E',
		templateUrl: 'views/showLinks.html'
	};
})

.directive('newLink', function() {
	return {
		restrict: 'E',
		templateUrl: 'views/newLink.html'
	};
});