myapp.controller("imageController",['$scope','$http','$window',function($scope,$http,$window){


 //array to store all searched keywords

//function to post query string to Server and fetch images result from google


$scope.getImage = false;
$scope.fetchImages = function(queryStr){
 $scope.getImage = false;
$scope.queryString = queryStr;
console.log($scope.queryString);

      $scope.data = {
            firstName: $scope.queryString
          };
          $http.post("/api/", JSON.stringify($scope.data)).then(function(success) {
            console.log('Data posted successfully');
          })
      };

      $scope.getImages = function(queryString){
      	$scope.getImage = true;
         // $window.open("images")
      	$http.get("/api/"+ queryString).then(function(success){
      	    $scope.images = success.data;
      		//console.log(success.data);
      	})
      }

 


}]);
