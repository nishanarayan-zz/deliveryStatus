// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
var delivery = angular.module('starter', ['ionic' , 'ui.bootstrap'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins.Keyboard) {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

      // Don't remove this line unless you know what you are doing. It stops the viewport
      // from snapping when text inputs are focused. Ionic handles this internally for
      // a much nicer keyboard experience.
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
});



delivery.controller('signInCtrl' , function($scope, $http, $rootScope){

	$scope.deliveryPerson = localStorage.getItem('deliveryPerson');
	$scope.hideSignInError = true ;
   
	$scope.signIn = function() {
		localStorage.removeItem('deliveryPerson');
		var deliveryPerson = {
				'UserName':$scope.username,
		        'Password':$scope.password
		}
		
		$http.defaults.headers.post["Content-Type"] = "application/json";
		$http.post('http://10.0.2.2:4000/verifyPerson',JSON.stringify(deliveryPerson)).then(
		function(response)	{
			if(response.data == 'Success'){
				localStorage.setItem('deliveryPerson', $scope.username);
				$rootScope.$broadcast('signIn');
				$scope.hideSignIn = true ;
			}
			else {
				$scope.hideSignInError = false ;
			}
			
		}	
		,
		function(response) {
		}
		);
	}
	
	$scope.$on('logout' , function(){
		$scope.hideSignInError = true ;
		$scope.hideSignIn = false ;	
	})
	
    
});







