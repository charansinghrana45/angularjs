var app = angular.module('myApp', ['ngAnimate','ngCookies','ngRoute']);

app.config(function ($routeProvider, $locationProvider) {

	$routeProvider.when('/', {

		templateUrl: 'home.html',
		controller: 'homeController',
		resolve: {
			check: function ($location, user) {

				if(user.isUserLoggedIn()) {
					$location.path('dashboard');
				}
			}
		}

	}).when('/login', {

		templateUrl: 'login.html',
		controller: 'loginController',
		resolve: {
			check: function ($location, user) {

				if(user.isUserLoggedIn()) {
					$location.path('dashboard');
				}
			}
		}

	}).when('/logout', {

		resolve: {

			deadResolve: function ($location, user) {
				user.clearData();
				$location.path('/');
			}
		}

	}).when('/dashboard', {

		templateUrl: 'dashboard.html',
		controller: 'dashboardController',
		resolve: {
			check: function ($location, user) {

				if(!user.isUserLoggedIn()) {
					$location.path('/login');
				}
			}
		}

	}).otherwise({

		redirectTo: '/'

	});

	$locationProvider.html5Mode(true);

});


app.service('user', function () {

var username;
var loggedIn = false;
var id;

this.getName = function () {
	return username;
}

this.getId = function () {
	return id;
}

this.isUserLoggedIn = function () {

	if(localStorage.getItem('login')) {

	loggedIn = true;
	var userInfo = JSON.parse(localStorage.getItem('login'));
	username = userInfo.user;
	id = userInfo.id;

	}
	return loggedIn;
}

this.saveData = function (data) {

	loggedIn = true;

	username = data.user;
	id = data.userUniqueId;

 	localStorage.setItem('login', JSON.stringify({
 		user: data.user,
 		id: data.userUniqueId 		
 	}));
 	console.log(localStorage);
}

this.clearData = function () {

	user = "";
	id = "";
	loggedIn = false;
	localStorage.removeItem('login');
}

});

app.controller('homeController', ['$scope', '$cookies', function ($scope, $cookies) {



}]);

app.controller('loginController', ['$scope', '$http', '$location', 'user', function ($scope, $http, $location, user) {

	$scope.login = function () {

		var email = $scope.email;
		var password = $scope.password;

		$http({
		  method: 'POST',
		  url: 'server/server.php',
		  data: 'email='+email+'&password='+password,
		  headers: {
		  	'content-type': 'application/x-www-form-urlencoded'
		  }
		  }).then(function (response) {
		    
		    if(response.data.status == 'loggedIn') {
		    	user.saveData(response.data);
		    	$location.path('/dashboard');
		    }
		    else
		    {
		    	alert("invalid data!");
		    }
		  });
	}

}]);


app.controller('dashboardController', ['$scope', 'user', '$http', '$location', function ($scope, user, $http, $location) {

$scope.user = user.getName();

$scope.setNewPassword = function () {
	var newPassword = $scope.newPassword;
	var userUniqueId = user.getId();

	$http({
		  method: 'POST',
		  url: 'server/change-password.php',
		  data: 'userUniqueId='+userUniqueId+'&newPassword='+newPassword,
		  headers: {
		  	'content-type': 'application/x-www-form-urlencoded'
		  }
		  }).then(function (response) {
		    
		    if(response.data.status == 'done') {
		    	user.clearData();
		    	$location.path('/login');
		    }
		    else
		    {
		    	alert("invalid data!");
		    }
		  });
}

}]);

