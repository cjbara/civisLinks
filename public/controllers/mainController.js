angular.module('mainCtrl', ['authCtrl'])

.controller('mainController', ['$scope', 'authStatus', function ($scope, auth) {

	var vm = this;

	vm.validUrl = '';

	vm.links = [];

	vm.sortOptions = [
		{
			value: 'Newest',
			property: 'timestamp',
			reverse: true
		}, {
			value: 'Oldest',
			property: 'timestamp',
			reverse: false
		}, {
			value: 'Most Popular',
			property: 'totalVotes',
			reverse: true
		}, {
			value: 'Least Popular',
			property: 'totalVotes',
			reverse: false
		}, {
			value: 'Alphabetically',
			property: 'url',
			reverse: false
		}, {
			value: 'Reverse Alphabetically',
			property: 'url',
			reverse: true
		}
	];

	vm.selectedSort = vm.sortOptions[0];

	// Initialize Firebase
	var config = {
		apiKey: "AIzaSyA-4gi_OpuZGAB2UsvhsF-Kyp_Atu6AG2k",
		authDomain: "civis-aacbe.firebaseapp.com",
		databaseURL: "https://civis-aacbe.firebaseio.com",
		storageBucket: "civis-aacbe.appspot.com",
		messagingSenderId: "194155980259"
	};
	firebase.initializeApp(config);
	
	var database = firebase.database();

	var linksRef = database.ref('links/');

	// Code to get all links
	linksRef.on('value', function(snapshot) {
		vm.links = snapshot.val();

		// So the order by function works
		vm.links = Object.keys(vm.links).map(function(key) {
			vm.links[key].id = key;
			return vm.links[key];
		});

		if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') {
		    $scope.$apply();
		}
	});

	// Code to add new link
	vm.addLink = function() {

		if(vm.validate()){
			var oldLink = linkExists();
			if(angular.isDefined(oldLink)) {
				vm.upvote(oldLink);
				Materialize.toast('Link is already in the system! We have upvoted the link for you!', 3000);
				vm.currentLink = '';
				vm.validUrl = '';
				return;
			}

			linksRef.push({
				url: vm.currentLink,
				votes: {},
				userId: auth.getUser().uid,
				userName: auth.getUser().displayName,
				userPicture: auth.getUser().photoURL,
				timestamp: firebase.database.ServerValue.TIMESTAMP
			});

			vm.currentLink = '';
			vm.validUrl = '';
			Materialize.toast('Link added successfully!', 2000);
		}
	};

	// Check if link exists
	var linkExists = function() {
		for(link in vm.links) {
			if(vm.links[link].url === vm.currentLink) {
				return vm.links[link].id;
			}
		}
		return undefined;
	}

	//Code to check if link is valid after every keystroke
	vm.validate = function() {
		// var pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
		// 	'((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.?)+[a-z]{2,}|'+ // domain name
		// 	'((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
		// 	'(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
		// 	'(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
		// 	'(\\#[-a-z\\d_]*)?$','i'); // fragment locator
		// if(!pattern.test(vm.currentLink)) {
		// 	vm.validUrl = "invalid";
		// 	return false;
		// } else {
			vm.validUrl = "valid";
			return true;
		// }
	};

	// Calculates the number of votes for a link
	vm.calcVotes = function(link){
		var total = 0;
		for(vote in link.votes) {
			total += link.votes[vote];
		}
		link.totalVotes = total;
		return total;
	}

	// Shows if a user has voted
	vm.upVoteColor = function(link) {
		for(vote in link.votes) {
			if(auth.getUser().uid === vote && link.votes[vote] === 1) {
				return 'blue';
			}
		}
		return 'black';
	}
	vm.downVoteColor = function(link) {
		for(vote in link.votes) {
			if(auth.getUser().uid === vote && link.votes[vote] === -1) {
				return 'blue';
			}
		}
		return 'black';
	}

	// Calculates the time since the link was posted
	vm.calcTime = function(date) {

	    var seconds = Math.floor((new Date() - date) / 1000);

	    var interval = Math.floor(seconds / 31536000);

	    if (interval > 1) {
	        return interval + " years";
	    }
	    interval = Math.floor(seconds / 2592000);
	    if (interval > 1) {
	        return interval + " months";
	    }
	    interval = Math.floor(seconds / 86400);
	    if (interval > 1) {
	        return interval + " days";
	    }
	    interval = Math.floor(seconds / 3600);
	    if (interval > 1) {
	        return interval + " hours";
	    }
	    interval = Math.floor(seconds / 60);
	    if (interval > 1) {
	        return interval + " minutes";
	    }
	    return Math.floor(seconds) + " seconds";
	}

	// Code to upvote a link
	vm.upvote = function(id) {
		linksRef.child(id + '/votes/' + auth.getUser().uid).set(1);
	}

	// Code to downvote a link
	vm.downvote = function(id) {
		linksRef.child(id + '/votes/' + auth.getUser().uid).set(-1);
	}

	//

}]);