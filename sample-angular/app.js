angular.module ("mainApp",["ngNeutralize"]).controller("mainController", function($scope){
    
    $scope.testMethod = function(){
        alert ("Test 123");
    }
});