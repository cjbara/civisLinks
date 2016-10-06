angular.module('authCtrl', [])

.controller('authController', ['$scope', 'authStatus', function ($scope, authStatus) {

	var vm = this;

	firebase.auth().onAuthStateChanged(function(user) {
	  if (user) {
	    vm.signedIn = true;
		vm.user = user;
		authStatus.setUser(vm.user);
		$scope.$apply();
	  } else {
	    vm.signedIn = false;
		vm.user = undefined;
	  }
	});
	
	var provider = new firebase.auth.FacebookAuthProvider();

	vm.fblogin = function() {
		firebase.auth().signInWithPopup(provider).then(function(result) {
		  vm.user = result.user;
		  vm.signedIn = true;
		  authStatus.setUser(vm.user);
		  angular.element('#closeModal').triggerHandler('click');
		}).catch(function(error) {
			Materialize.toast('Error signing in.', 2000);
		});
	}

	vm.logout = function() {
		firebase.auth().signOut().then(function() {
		  // Sign-out successful.
		  vm.signedIn = false;
		  vm.user = undefined;
		  $scope.$apply();
		}, function(error) {
		  Materialize.toast('Error signing out.', 2000);
		});
	};
}]);