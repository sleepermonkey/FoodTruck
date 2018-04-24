app.controller﻿("FoodTruckProfileController", function ($scope, $http, BaseService, FT_PATH, MENU_PATH, SYSTEM_PATH, $timeout, $filter) {

    Opening();

    function Opening() {
        $scope.formData = {};
        $scope.DislikeMode = 0;
        $scope.DislikeMenuStyleHeader = {};
        $scope.DislikeMenuStyleList = [];
        $scope.DislikeMenuHeader = {};
        $scope.DislikeMenuBaseList = [];
        $scope.DislikeMenuList = [];
        $scope.sqlFinished = false;
        GetData();

        BaseService.GetHeaderGridView("MenuStyleList2")
            .then(function (result) {
                $scope.DislikeMenuStyleHeader = result;
            }, function (error) {
                console.log('Unable to load menu type header data: ' + error.message)
            })

        BaseService.GetHeaderGridView("MenuList2")
            .then(function (result) {
                $scope.DislikeMenuHeader = result;
            }, function (error) {
                console.log('Unable to load menu type header data: ' + error.message)
            })

        BaseService.GetDataTable(FT_PATH, "GetDislikeMenuStyleList")
            .then(function (result) {
                $scope.DislikeMenuStyleList = result;
                console.log($scope.DislikeMenuStyleList);
            }, function (error) {
                console.log('Unable to load menu type data: ' + error.message)
            })

        BaseService.GetDataTable(FT_PATH, "GetDislikeMenuList")
            .then(function (result) {
                $scope.DislikeMenuBaseList = result;
            }, function (error) {
                console.log('Unable to load menu type data: ' + error.message)
            })
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

    $scope.$watchGroup(['DislikeMenuStyleList', 'DislikeMenuBaseList'], function (newValues, oldValues, scope) {
        if ($scope.DislikeMenuBaseList.length > 0 && $scope.DislikeMenuStyleList.length > 0) {
            var _dislike = $filter('filter')($scope.DislikeMenuStyleList, { 'EDIT': true }, true)
            for (var i = 0; i < _dislike.length; i++) {
                var _dislike2 = $filter('filter')($scope.DislikeMenuBaseList, { 'ITEM_STYLE_ID': _dislike[i].ITEM_STYLE_ID }, true);
                angular.forEach(_dislike2, function (menu) { menu.EDIT = true; });
            }

            var _dislike = $filter('filter')($scope.DislikeMenuStyleList, { 'EDIT': false }, true)
            for (var i = 0; i < _dislike.length; i++) {
                var _dislike2 = $filter('filter')($scope.DislikeMenuBaseList, { 'EDIT': true, 'ITEM_STYLE_ID': _dislike[i].ITEM_STYLE_ID }, true);
                if (_dislike2.length > 0) {
                    var checkbox = document.getElementById("StyleCheckBox" + _dislike[i].ITEM_STYLE_ID);
                    checkbox.indeterminate = true;
                }
            }
        }
    });

    $scope.OrderColumn = function (pColName) {
        $scope.sortType = pColName;
        $scope.sortReverse = !$scope.sortReverse;
    };

    $scope.setRadiusCol = function (field) {
        if (field == 'NEXT' || field ==  'ITEM_STYLE_NAME') {
            return { 'border-top-right-radius': "6px"};
        }
    }

    $scope.DislikeDetail = function (ITEM_STYLE_ID) {
        $scope.DislikeMode = 1;
        $scope.DislikeMenuList = $filter('filter')($scope.DislikeMenuBaseList, { 'ITEM_STYLE_ID': ITEM_STYLE_ID }, true);
    }

    $scope.itemStyleChecked = function (item) {
        $scope.selectedDislikeMenuList = $filter('filter')($scope.DislikeMenuBaseList, { 'ITEM_STYLE_ID': item.ITEM_STYLE_ID }, true);
        angular.forEach($scope.selectedDislikeMenuList, function (menu) { menu.EDIT = item.EDIT; });
    }

    $scope.itemMenuChecked = function (item) {
        $scope.selectedDislikeMenuList = $filter('filter')($scope.DislikeMenuList, { 'EDIT': true }, true);
        if ($scope.selectedDislikeMenuList.length == $scope.DislikeMenuList.length) {
            $scope.selectedDislikeMenuStyleList = $filter('filter')($scope.DislikeMenuStyleList, { 'ITEM_STYLE_ID': item.ITEM_STYLE_ID }, true);
            angular.forEach($scope.selectedDislikeMenuStyleList, function (menu) { menu.EDIT = item.EDIT; });
            var checkbox = document.getElementById("StyleCheckBox" + item.ITEM_STYLE_ID);
            checkbox.indeterminate = false;
        } else if ($scope.selectedDislikeMenuList.length > 0) {
            var checkbox = document.getElementById("StyleCheckBox" + item.ITEM_STYLE_ID);
            checkbox.indeterminate = true;
        } else {
            $scope.selectedDislikeMenuStyleList = $filter('filter')($scope.DislikeMenuStyleList, { 'ITEM_STYLE_ID': item.ITEM_STYLE_ID }, true);
            angular.forEach($scope.selectedDislikeMenuStyleList, function (menu) { menu.EDIT = item.EDIT; });
            var checkbox = document.getElementById("StyleCheckBox" + item.ITEM_STYLE_ID);
            checkbox.indeterminate = false;
        }
    }

    $scope.BacktoDislikeMenuStyle = function () {
        $scope.DislikeMode = 0;
    }

    $scope.ProfileSubmit = function () {
        BaseService.CallAction(FT_PATH, "DeleteDislikeMenu", null)
            .then(function (result) {
            }, function (error) {
                BaseService.Message.alert('ไม่สามารถบันทึกข้อมูลได้');
                console.log('Unable to edit menu type data: ' + error.message)
            })

        var _dislike = $filter('filter')($scope.DislikeMenuStyleList, { 'EDIT': true }, true)
        for (var i = 0; i < _dislike.length; i++) {
            let scopeData = _dislike[i];
            let data = $.param(scopeData)

            BaseService.CallAction(FT_PATH, "SubmitDislikeMenuStyle", data)
                .then(function (result) {
                }, function (error) {
                    BaseService.Message.alert('ไม่สามารถบันทึกข้อมูลได้');
                    console.log('Unable to edit menu type data: ' + error.message)
                })
        }
        
        _dislike = $filter('filter')($scope.DislikeMenuStyleList, { 'EDIT': false }, true);
        for (var i = 0; i < _dislike.length; i++) {
            var _dislike2 = $filter('filter')($scope.DislikeMenuBaseList, { 'EDIT': true, 'ITEM_STYLE_ID': _dislike[i].ITEM_STYLE_ID }, true)
            for (var i = 0; i < _dislike2.length; i++) {
                let scopeData = _dislike2[i];
                let data = $.param(scopeData)

                BaseService.CallAction(FT_PATH, "SubmitDislikeMenu", data)
                    .then(function (result) {
                    }, function (error) {
                        BaseService.Message.alert('ไม่สามารถบันทึกข้อมูลได้');
                        console.log('Unable to edit menu type data: ' + error.message)
                    })

                if (i == _dislike.length - 1) {
                    BaseService.Message.info('บันทึกข้อมูลเรียบร้อย');
                }
            }
        }
     }
})