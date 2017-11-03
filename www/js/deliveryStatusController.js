delivery.controller('deliveryStatusController' , function($scope, $http, $interval, $uibModal, $rootScope, $window) {
		
	$scope.deliveryList = "" ;
	$scope.selectedOrder = "" ;
	$scope.hideOrders = true ;
	$scope.hideLogOff = true ;
    $scope.Order = "Order" ;
    $scope.Status = "Status" ;
	
	var getOrders = function() {
		var deliveryPerson = {
				'DeliveryPerson':$scope.deliveryPerson,
				'OrderStatus':'OutForDelivery'
		}
		
		$http.post('http://10.0.2.2:4000/deliveryOrders' , JSON.stringify(deliveryPerson)).then(
		  function(response){
			  if(response.data != 'Failed'){
				  $scope.deliveryList = response.data ;
			  }
			  else {
				  $scope.deliveryList = "";
			  }
		  }	,
		  function(response){
			  console.log(response.data); 
		  }
		);
	}
	
	$scope.$on('signIn', function() {
		$scope.hideOrders = false ;
		$scope.hideLogOff = false ;
		$scope.deliveryPerson = localStorage.getItem("deliveryPerson") ;
    	$scope.deliveryPerson =  $scope.deliveryPerson.charAt(0).toUpperCase()+$scope.deliveryPerson.substring(1) ;
    	getOrders() ;
    	$interval(getOrders, 30000);
	}); 
	
	
	$scope.isItemDelivered = function(orderId) {
		if($scope.deliveryList.filter(function (obj) {
			return obj._id  == orderId ;
		})[0].OrderStatus == "Delivered" ) return orderId ;
		else return "" ;
	}
	
	
	$scope.updateDeliveryStatus = function(orderId) {
		var deliveryStatus = {
				OrderId : orderId ,
				OrderStatus:'Delivered',
				DeliveryTime: new Date() 
		}

		$http.post('http://10.0.2.2:4000/updateDeliveryStatus',JSON.stringify(deliveryStatus)).then(
			       function(response){
			    	   if(response.data != "Failed"){  
			    		   $scope.deliveryList.filter(function (obj) {
	        					return obj._id  == orderId ;
	        	            })[0].OrderStatus = 'Delivered' ; 
			    		   $scope.deliveryList.filter(function (obj) {
	        					return obj._id  == orderId ;
	        	            })[0].StatusProgress = 'Delivered' ;
			    		   $scope.deliveryList.filter(function (obj) {
	        					return obj._id  == orderId ;
	        	            })[0].DeliveryTime = deliveryStatus.DeliveryTime ;
			           }
			       },
			       function(response){
			    	   console.log("http post error");
			       }
			       );
	}
	
	$scope.showDeliveryAddress = function(orderId){
		$scope.selectedOrder = orderId ;
		$scope.customerAddress = $scope.deliveryList.filter(function (obj) {
			                       return obj._id  == orderId ;
                                 })[0].DeliveryAddress ;
        $scope.customerPhone = $scope.deliveryList.filter(function (obj) {
                                   return obj._id  == orderId ;
                                })[0].CustomerPhone ;
        $window.scrollTo(0, 0);
		$uibModal.open({
			animation: $scope.animationsEnabled,
			templateUrl: 'customerAddress.html',
			controller: 'addressModalInstanceCtrl',
			resolve: {
				customerAddress : function() {
					return $scope.customerAddress ;
				},
				customerPhone : function() {
					return $scope.customerPhone ;
				}
			}
		});
	}
	
	$scope.isOrderSelected = function(orderId) {
		if($scope.selectedOrder == orderId) return true;	
		else return "" ;
	}
	
	$scope.$on('modalClosing', function() {
		$scope.selectedOrder = "" ;
	}); 
	
	$scope.logOut = function() {
		$scope.hideOrders = true ;
		$scope.hideLogOff = true ;
		$rootScope.$broadcast('logout');
	}	
   
});


delivery.controller('addressModalInstanceCtrl', function ($scope, $uibModalInstance , customerAddress, customerPhone, $rootScope) {
	$scope.hideModal = function () {
		$uibModalInstance.close();
		$rootScope.$broadcast('modalClosing');
	}
	$scope.customerAddress = customerAddress;
	$scope.customerPhone = customerPhone;
});

