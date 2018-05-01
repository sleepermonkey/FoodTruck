app.controller﻿("FoodTruckProfileController", function ($scope, $http, BaseService, FT_PATH, MENU_PATH, SYSTEM_PATH, $timeout, $filter) {

    Opening();

    function Opening() {
        $scope.formData = {};

        $scope.OwnMenuHeader = {};
        $scope.OwnMenuList = [];
        $scope.newMenu = {};
        $scope.newMenu.NAME = '';
        $scope.newMenu.MAIN_ITEM = false; 

        $scope.DislikeMode = 0;
        $scope.DislikeMenuStyleHeader = {};
        $scope.DislikeMenuStyleList = [];
        $scope.DislikeMenuHeader = {};
        $scope.DislikeMenuBaseList = [];
        $scope.DislikeMenuList = [];
        $scope.deleteFinished = false;

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

        BaseService.GetHeaderGridView("MenuList3")
            .then(function (result) {
                $scope.OwnMenuHeader = result;
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

        BaseService.GetDataTable(FT_PATH, "GetOwnMenuList")
            .then(function (result) {
                $scope.OwnMenuList = result;
                console.log(result);
            }, function (error) {
                console.log('Unable to load menu type data: ' + error.message)
            });
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
        if (field == 'NEXT' || field == 'ITEM_STYLE_NAME' || field == 'MAIN_ITEM') {
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
        $scope.selectedDislikeMenuStyleList = $filter('filter')($scope.DislikeMenuStyleList, { 'ITEM_STYLE_ID': item.ITEM_STYLE_ID }, true);
        if ($scope.selectedDislikeMenuList.length == $scope.DislikeMenuList.length) {
            angular.forEach($scope.selectedDislikeMenuStyleList, function (menu) { menu.EDIT = item.EDIT; });
            var checkbox = document.getElementById("StyleCheckBox" + item.ITEM_STYLE_ID);
            checkbox.indeterminate = false;
        } else if ($scope.selectedDislikeMenuList.length > 0) {
            angular.forEach($scope.selectedDislikeMenuStyleList, function (menu) { menu.EDIT = false; });
            var checkbox = document.getElementById("StyleCheckBox" + item.ITEM_STYLE_ID);
            checkbox.indeterminate = true;
        } else {
            angular.forEach($scope.selectedDislikeMenuStyleList, function (menu) { menu.EDIT = item.EDIT; });
            var checkbox = document.getElementById("StyleCheckBox" + item.ITEM_STYLE_ID);
            checkbox.indeterminate = false;
        }
    }

    $scope.BacktoDislikeMenuStyle = function () {
        $scope.DislikeMode = 0;
    }

    $scope.ProfileSubmit = function () {
        let scopeData = $scope.formData.foodtruck;
        let data = $.param(scopeData)
        BaseService.CallAction(FT_PATH, "SubmitShop", data)
            .then(function (result) {
            }, function (error) {
                BaseService.Message.alert('ไม่สามารถบันทึกข้อมูลได้');
                console.log('Unable to edit menu type data: ' + error.message)
            });

        BaseService.CallAction(FT_PATH, "DeleteDislikeMenu", null)
            .then(function (result) {
                $scope.deleteFinished = true;
            }, function (error) {
                BaseService.Message.alert('ไม่สามารถบันทึกข้อมูลได้');
                console.log('Unable to edit menu type data: ' + error.message)
            });
    }

    $scope.$watch('deleteFinished', function (newVal, oldVal) {
        if (newVal == true) {
            var _dislike = $filter('filter')($scope.DislikeMenuStyleList, { 'EDIT': true }, true)
            for (var i = 0; i < _dislike.length; i++) {
                let scopeData = _dislike[i];
                let data = $.param(scopeData)

                BaseService.CallAction(FT_PATH, "SubmitDislikeMenuStyle", data)
                    .then(function (result) {
                    }, function (error) {
                        BaseService.Message.alert('ไม่สามารถบันทึกข้อมูลได้');
                        console.log('Unable to edit menu type data: ' + error.message)
                    });
            }

            _dislike = $filter('filter')($scope.DislikeMenuStyleList, { 'EDIT': false }, true);
            for (var i = 0; i < _dislike.length; i++) {
                var _dislike2 = $filter('filter')($scope.DislikeMenuBaseList, { 'EDIT': true, 'ITEM_STYLE_ID': _dislike[i].ITEM_STYLE_ID }, true)
                for (var j = 0; j < _dislike2.length; j++) {
                    let scopeData = _dislike2[j];
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
    });

    $scope.AddNewMenuView = function () {
        document.getElementById('DetailModal').style.display = 'block';
    }

    $scope.submitMenu = function () {
        let scopeData = $scope.newMenu;
        let data = $.param(scopeData)
        BaseService.CallAction(FT_PATH, "SubmitNewMenu", data)
            .then(function (result) {
                BaseService.Message.alert('บันทึกข้อมูลสำเร็จ');
                document.getElementById('DetailModal').style.display = 'none';
                BaseService.GetDataTable(FT_PATH, "GetOwnMenuList")
                    .then(function (result) {
                        $scope.OwnMenuList = result;
                        console.log(result);
                    }, function (error) {
                        console.log('Unable to load menu type data: ' + error.message)
                    });
            }, function (error) {
                BaseService.Message.alert('ไม่สามารถบันทึกข้อมูลได้');
                console.log('Unable to edit menu type data: ' + error.message)
            });
    }
})

app.controller﻿("EventRegisterViewController", function ($scope, $http, BaseService, EVENT_PATH, Upload, $timeout) {

    Opening();

    function Opening() {
        $scope.formData = {};
        $scope.DATE_FROM = new Date()
        $scope.DATE_TO = new Date()
        GetData();
    }

    function GetData() {
        BaseService.GetDataTable(EVENT_PATH, "GetEventList")
            .then(function (result) {
                console.log(result);
                $scope.ListEvent = $scope.matrixList(result, 3);
            }, function (error) {
                console.log('Unable to load event data: ' + error.message)
            })
    }

    $scope.matrixList = function (data, n) {
        var grid = [], i = 0, x = data.length, col, row = -1;
        for (var i = 0; i < x; i++) {
            col = i % n;
            if (col === 0) {
                grid[++row] = [];
            }
            grid[row][col] = data[i];
        }
        return grid;
    };

    $scope.openEvent = function (ID) {
        document.getElementById('DetailModal').style.display = 'block';
        var sendData = [{ "ID": ID }];
        var data = $.param(sendData[0]);

        BaseService.CallAction(EVENT_PATH, "GetEventList", data)
            .then(function (result) {
                $scope.formData.EventDetail = result[0]
            }, function (error) {
                console.log('Unable to load menu type data: ' + error.message)
            })
    }

    $scope.CloseItem_Click = function (ID) {
        document.getElementById('DetailModal').style.display = 'none';
    }

    $scope.openStartDate = function () {
        $scope.popupStartDate.opened = true;
    }

    $scope.popupStartDate = {
        opened: false
    }

    $scope.openEndDate = function () {
        $scope.popupEndDate.opened = true;
    }

    $scope.popupEndDate = {
        opened: false
    }
})

app.controller﻿("RegisterEventController", function ($scope, $http, BaseService, FT_PATH, EVENT_PATH, $timeout) {

    Opening();

    function Opening() {
        $scope.ListHeader = {};
        $scope.formData = {};
        $scope.TableWidth = 0;
        $scope.TableHeight = 0;
        $scope.EventDate = []
        $scope.TotalDays = 0;
        GetData();
    }

    function GetData() {
        BaseService.CallAction(EVENT_PATH, "GetEvent", null)
            .then(function (result) {
                $scope.formData.Event = result[0];
                var EndDate = new Date($scope.formData.Event.END_DATE);
                var StartDate = new Date($scope.formData.Event.START_DATE);
                var timeDiff = Math.abs(EndDate.getTime() - StartDate.getTime());
                var DayLength = Math.ceil(timeDiff / (1000 * 3600 * 24)) + 1;
                if (DayLength <= 7) {
                    $scope.TableWidth = 150 * DayLength;
                    $scope.TableHeight = 150;
                } else {
                    $scope.TableWidth = 150 * DayLength;
                    $scope.TableHeight = 150 * (($scope.DayLength / 7) + 1);
                }
                for (var i = 0; i < DayLength; i++) {
                    var _date = new Date($scope.formData.Event.START_DATE);
                    _date.setDate(_date.getDate() + i);
                    $scope.EventDate.push({
                        'ED': _date,
                        'SELECTED': false});
                }
                console.log($scope.EventDate);
            }, function (error) {
                BaseService.Message.alert('ไม่สามารถบันทึกข้อมูลได้');
                console.log('Unable to edit event data: ' + error.message)
            })
    }

    $scope.dateCheck = function () {
        $scope.TotalDays = 0;
        for (var i = 0; i < $scope.EventDate.length; i++) {
            if ($scope.EventDate[i].SELECTED)
                $scope.TotalDays++;
        }
    }

    $scope.registerEvent = function () {
        for (var i = 0; i < $scope.EventDate.length; i++) {
            if (!$scope.EventDate[i].SELECTED)
                continue;

            let scopeData = $scope.EventDate[i];
            let data = $.param(scopeData);
            BaseService.CallAction(FT_PATH, "RegisterFoodtruck", data)
                .then(function (result) {
                }, function (error) {
                    BaseService.Message.alert('ไม่สามารถบันทึกข้อมูลได้');
                    console.log('Unable to edit event data: ' + error.message)
                })
        }
    }
})

