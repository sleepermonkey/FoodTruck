app.controller﻿("FoodTruckProfileController", function ($scope, $http, BaseService, FT_PATH, SYSTEM_PATH, $timeout) {

    Opening();

    function Opening() {
        $scope.formData = {};
        GetData();
    }
    
    function GetData() {
        BaseService.GetDataTable(FT_PATH, "GetFoodtruckProfile")
            .then(function (result) {
                console.log(result);
                $scope.formData.foodtruck = result[0];
            }, function (error) {
                console.log('Unable to load event data: ' + error.message)
            })
    }

    $scope.OrderColumn = function (pColName) {
        $scope.sortType = pColName;
        $scope.sortReverse = !$scope.sortReverse;
    };

    $scope.CheckPagination = function () {
        if (($scope.FILTER.EVENT_ID != null && $scope.FILTER.EVENT_ID != '') ||
            ($scope.FILTER.EVENT_NAME != null && $scope.FILTER.EVENT_NAME != '') ||
            ($scope.FILTER.EVENT_PLACE != null && $scope.FILTER.EVENT_PLACE != '')) {
            document.getElementById('PaginationDiv').style.visibility = "hidden";
        } else {
            document.getElementById('PaginationDiv').style.visibility = "visible";
        }
    };
})