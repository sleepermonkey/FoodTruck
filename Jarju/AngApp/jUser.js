app.controller﻿("EventDisplayController", function ($scope, $http, BaseService, EVENT_PATH, Upload, $timeout) {

    Opening();

    function Opening() {
        $scope.formData = {};
        $scope.DATE_FROM = new Date()
        $scope.DATE_TO = new Date()
        $scope.SelectedEvent = 0;
        $scope.Review = "";
        $scope.Rate = 0;
        $scope.ReviewList = [];
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
        $scope.SelectedEvent = ID;
        var sendData = [{ "ID": ID }];
        var data = $.param(sendData[0]);

        BaseService.CallAction(EVENT_PATH, "GetEventList", data)
            .then(function (result) {
                $scope.formData.EventDetail = result[0]
            }, function (error) {
                console.log('Unable to load menu type data: ' + error.message)
            })

        BaseService.CallAction(EVENT_PATH, "GetSummaryEventReview", data)
            .then(function (result) {
                $scope.ReviewList = result;
                console.log(result)
            }, function (error) {
                console.log('Unable to load event data: ' + error.message)
            })
    }

    $scope.CloseItem_Click = function (ID) {
        document.getElementById('DetailModal').style.display = 'none';
    }

    $scope.submitReview = function () {

        if ($scope.Rate == 0 || $scope.Review == "") {
            BaseService.Message.alert('กรุณากรอกข้อมูลให้ครบถ้วน');
            return;
        }

        var sendData = [{
            "ID": $scope.SelectedEvent,
            "RATE": $scope.Rate,
            "REVIEW": $scope.Review
        }];
        var data = $.param(sendData[0]);

        BaseService.CallAction(EVENT_PATH, "SubmitReview", data)
            .then(function (result) {
                BaseService.Message.alert('บันทึกข้อมูลสำเร็จ');
            }, function (error) {
                console.log('Unable to load menu type data: ' + error.message)
            })
    }
})

app.controller﻿("CreateEventController", function ($scope, $http, BaseService, EVENT_PATH, SYSTEM_PATH, Upload, $window, $timeout) {

    Opening();

    function Opening() {
        $scope.formData = {};
        $scope.formData.Event = {};
        $scope.formData.Event.EVENT_ID = 0;
        $scope.formData.Event.START_DATE = new Date()
        $scope.formData.Event.END_DATE  = new Date()
        $scope.fileUpload = null;

        BaseService.CallAction(SYSTEM_PATH, "GetUserID", "0")
            .then(function (result) {
                $scope.user = result;
            }, function (error) {
                BaseService.Message.alert('ไม่สามารถบันทึกข้อมูลได้');
                console.log('Unable to edit menu type data: ' + error.message)
            })

        BaseService.CallAction(EVENT_PATH, "GetEvent", null)
            .then(function (result) {
                $scope.formData.Event = result[0];
            }, function (error) {
                BaseService.Message.alert('ไม่สามารถบันทึกข้อมูลได้');
                console.log('Unable to edit event data: ' + error.message)
            })

        BaseService.CallAction(EVENT_PATH, "GetDepositList", null)
            .then(function (result) {
                $scope.formData.DepositList = result;
                console.log(result)
            }, function (error) {
                BaseService.Message.alert('ไม่สามารถบันทึกข้อมูลได้');
                console.log('Unable to edit event data: ' + error.message)
            })
    }

    function uploadCoverImage() {

        var file = $scope.fileUpload;

        $scope.fileName = file.name;
        $scope.ListDetail = null;

        file.upload = Upload.upload({
            url: window.location.origin + EVENT_PATH + '/UploadCoverImage',
            data: { File: file, ID: $scope.formData.Event.EVENT_ID},
        });

        file.upload.then(function (res) {
            $timeout(function () {
                if (res.data.result == 500) {
                    BaseService.Message.alert("Please insert file.");
                } else if (res.data.result == 200) {
                    BaseService.Message.alert((res.data.data));
                } else {
                    $scope.formData.Event.COVER_PATH = "/Upload/Event/Cover/" +
                        $scope.formData.Event.EVENT_ID + "/" +
                        $scope.fileName;
                    BaseService.Message.alert("บันทึกข้อมูลสำเร็จ");
                }
            })
        }, function (res) {
            if (res.status > 0) {
                $scope.errorMsg = res.status + ': ' + res.data;
                BaseService.Message.alert("Cannot upload file")
            }
        }, function (evt) {
            file.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
        });
    };

    $scope.submitEvent = function () {
        if (angular.isUndefined($scope.formData.Event) ||
            $scope.formData.Event.EVENT_NAME == null ||
            $scope.formData.Event.EVENT_NAME == '') {

            BaseService.Message.alert('กรุณากรอกข้อมูลให้ครบถ้วน');
            return;
        } else if ($scope.user == null || $scope.user == "") {
            BaseService.Message.alert('กรุณาล็อกอิน');
        }
        else {
            let scopeData = $scope.formData.Event;
            let data = $.param(scopeData)

            BaseService.CallAction(EVENT_PATH, "SubmitEvent", data)
                .then(function (result) {
                    $scope.formData.Event = result[0];
                    $scope.formData.Event.START_DATE = new Date($scope.formData.Event.START_DATE);
                    $scope.formData.Event.END_DATE = new Date($scope.formData.Event.END_DATE);

                    if ($scope.fileUpload != null)
                        uploadCoverImage();
                    else
                        BaseService.Message.alert('บันทึกข้อมูลสำเร็จ');

                }, function (error) {
                    BaseService.Message.alert('ไม่สามารถบันทึกข้อมูลได้');
                    console.log('Unable to edit event data: ' + error.message)
                })
        }
    }

    $scope.editEventPlan = function () {
        $window.location = '/Event/EventFloorPlan/' + $scope.formData.Event.EVENT_ID;
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

    $scope.startDate_Change = function () {
        if ($scope.formData.Event.START_DATE > $scope.formData.Event.END_DATE)
            $scope.formData.Event.START_DATE = $scope.formData.Event.END_DATE;
    }

    String.prototype.trunc = String.prototype.trunc ||
        function (n) {
            return this.split(',')[0];
        };

    $scope.DepositStatus = function () {
        document.getElementById('DepositModal').style.display = 'block';
    }

    $scope.checkDepositStatus = function (_status) {
        if (_status == 1)
            return 'Unpaid';
        else if (_status == 2)
            return 'Invited';
        else if (_status == 3)
            return 'Waiting for confirm';
        else if (_status == 4)
            return 'Confirmed';
    }

    $scope.ConfirmDeposit = function (row) {
        BaseService.Message.confirm('Confirm payment?')
            .then(function () {
                let scopeData = {
                    'SHOP_ID': row.SHOP_ID,
                    'EVENT_ID': $scope.formData.Event.EVENT_ID
                };
                let data = $.param(scopeData)

                BaseService.CallAction(EVENT_PATH, "ConfirmDeposit", data)
                    .then(function (result) {
                        BaseService.Message.alert('บันทึกข้อมูลสำเร็จ');
                        row.STATUS = 4;
                    }, function (error) {
                        BaseService.Message.alert('ไม่สามารถบันทึกข้อมูลได้');
                        console.log('Unable to edit event data: ' + error.message)
                    })
            });
    }
})

app.controller﻿("ManageEventController", function ($scope, $http, BaseService, EVENT_PATH, SYSTEM_PATH, $timeout) {

    Opening();

    function Opening() {
        $scope.ListHeader = {};
        $scope.formData = {};
        GetHeader();
        GetData();
    }

    function GetHeader() {
        BaseService.GetHeaderGridView("EventList")
            .then(function (result) {
                $scope.ListHeader = result
                console.log(result)
            }, function (error) {
                console.log('Unable to load event header data: ' + error.message)
            })
    }

    function GetData() {
        BaseService.GetDataTable(EVENT_PATH, "GetEventList")
            .then(function (result) {
                console.log(result);
                $scope.ListDetail = result;
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

app.controller﻿("FloorPlanController", function ($scope, $http, BaseService, EVENT_PATH, FT_PATH, Upload, $timeout, $filter) {

    Opening();

    function Opening() {
        $scope.planMode = 0;
        $scope.drawMode = 0;
        $scope.ObjectType = 0;
        $scope.ObjectOrientation = 0;
        $scope.gridRow = 64;
        $scope.gridColumn = 64;
        $scope.gridWidth = '10px';
        $scope.gridHeight = '10px';
        $scope.ObjectWidth = 6;
        $scope.ObjectDepth = 3;
        $scope.ObjectPosition = [];
        $scope.ObjectGroup = [];
        $scope.fileUpload = null;
        $scope.StartBlock = null;
        $scope.EndBlock = null;
        $scope.StartBlockState = false;
        $scope.EndBlockState = false;
        $scope.CurrentInsertBlock = 0;

        $scope.formData = {};
        $scope.formData.Event = {};
        $scope.formData.Event.PLAN_PATH = '';
        $scope.formData.Shop = {};
        $scope.formData.ShopList = []; 
        $scope.SelectedShop = {};
        
        $scope.NearList = [];
        $scope.RegisterShop = [];
        $scope.RegisterShopAmount = [];
        $scope.RegisterShopLength = 0;
        $scope.RegisterShopLength2 = 0;
        $scope.ShopMenu = [];
        $scope.ShopDislikeMenu = [];
        $scope.ShopDislikeStyle = [];

        $scope.TableWidth = 0;
        $scope.TableHeight = 0;
        $scope.FTRegister = [];

        $scope.formData.InviteFT = {};
        $scope.AllFT = [];

        BaseService.CallAction(EVENT_PATH, "GetEvent", null)
            .then(function (result) {
                $scope.formData.Event = result[0];
                $scope.calculateGrid();
            }, function (error) {
                BaseService.Message.alert('ไม่สามารถบันทึกข้อมูลได้');
                console.log('Unable to edit event data: ' + error.message)
            })

        BaseService.CallAction(EVENT_PATH, "GetPlanShop", null)
            .then(function (result) {
                $scope.formData.Shop = result;
                for (var i = 0; i < $scope.formData.Shop.length; i++) {
                    var _ftString = $scope.formData.Shop[i].SHOP_POSITION;
                    var _ftSplit = _ftString.split("|");
                    for (var j = 0; j < _ftSplit.length; j++) {
                        $scope.ObjectPosition.push({
                            parent: parseInt(_ftSplit[j].split(",")[1]),
                            index: parseInt(_ftSplit[j].split(",")[0]),
                            ObjectType: 0,
                            ObjectGroup: 0
                        });
                    }

                    $scope.formData.ShopList.push({
                        LOCAL_ID: $scope.formData.Shop[i].LOCAL_ID,
                        EVENT_ID: $scope.formData.Event.EVENT_ID,
                        NAME: $scope.formData.Shop[i].NAME,
                        PRICE: $scope.formData.Shop[i].PRICE,
                        DEPOSIT_FEE_RATE: $scope.formData.Shop[i].DEPOSIT_FEE_RATE,
                        FT: _ftString,
                        BLOCK_ID: $scope.formData.Shop[i].BLOCK_ID
                    });
                }

            }, function (error) {
                BaseService.Message.alert('ไม่สามารถบันทึกข้อมูลได้');
                console.log('Unable to edit event data: ' + error.message)
            })

        BaseService.CallAction(FT_PATH, "GetFoodtruckList", null)
            .then(function (result) {
                $scope.AllFT = result;
                console.log($scope.AllFT);
            }, function (error) {
                BaseService.Message.alert('ไม่สามารถบันทึกข้อมูลได้');
                console.log('Unable to edit event data: ' + error.message)
            })
    }

    $scope.setObjectType = function (type) {
        $scope.ObjectType = type;
    }

    $scope.setDrawMode = function (mode) {
        $scope.drawMode = mode;
    }

    $scope.switchOrientation = function () {
        var tmp = $scope.ObjectWidth;
        $scope.ObjectWidth = $scope.ObjectDepth;
        $scope.ObjectDepth = tmp;
    }

    $scope.mouseOverPosition = function ($parentIndex, $index) {
        if ($scope.planMode == 0) {
            var activeClass = '';
            if ($scope.ObjectType == 0) {
                activeClass = 'activeFoodTruckOver';
            } else if ($scope.ObjectType == 1) {
                activeClass = 'activeStageOver';
            } else if ($scope.ObjectType == 2) {
                activeClass = 'activeWallOver';
            }

            if ($scope.drawMode == 1) {
                for (var i = 0; i < $scope.ObjectDepth; i++) {
                    for (var j = 0; j < $scope.ObjectWidth; j++) {
                        document.getElementById(parseInt($parentIndex + i) + "," + parseInt($index + j)).classList.add(activeClass);
                    }
                }
            } else {
                document.getElementById($parentIndex + "," + $index).classList.add(activeClass);
            }
        }
    }

    $scope.mouseLeavePosition = function ($parentIndex, $index) {

        var activeClass = '';
        if ($scope.ObjectType == 0) {
            activeClass = 'activeFoodTruckOver';
        } else if ($scope.ObjectType == 1) {
            activeClass = 'activeStageOver';
        } else if ($scope.ObjectType == 2) {
            activeClass = 'activeWallOver';
        }

        if ($scope.drawMode == 1) {
            for (var i = 0; i < $scope.ObjectDepth; i++) {
                for (var j = 0; j < $scope.ObjectWidth; j++) {
                    document.getElementById(parseInt($parentIndex + i) + "," + parseInt($index + j)).classList.remove(activeClass);
                }
            }
        } else {
            document.getElementById($parentIndex + "," + $index).classList.remove(activeClass);
        }
    }

    $scope.selectPosition = function ($parentIndex, $index) {
        if ($scope.planMode == 0) {
            if ($scope.drawMode == 0) {
                for (var i = 0; i < $scope.ObjectPosition.length; i++) {
                    if ($scope.ObjectPosition[i].index == $index && $scope.ObjectPosition[i].parent == $parentIndex) {
                        $scope.ObjectPosition.splice(i, 1);
                        break;
                    }
                }

                $scope.ObjectPosition.push({
                    parent: $parentIndex,
                    index: $index,
                    ObjectType: $scope.ObjectType,
                    ObjectGroup: 0
                });
            } else if ($scope.drawMode == 1) {
                for (var i = 0; i < $scope.ObjectDepth; i++) {
                    for (var j = 0; j < $scope.ObjectWidth; j++) {
                        for (var k = 0; k < $scope.ObjectPosition.length; k++) {
                            if ($scope.ObjectPosition[k].index == parseInt($index + j) && $scope.ObjectPosition[k].parent == parseInt($parentIndex + i)) {
                                $scope.ObjectPosition.splice(k, 1);
                                break;
                            }
                        }

                        $scope.ObjectPosition.push({
                            parent: parseInt($parentIndex + i),
                            index: parseInt($index + j),
                            ObjectType: $scope.ObjectType,
                            ObjectGroup: 0
                        });
                    }
                }
            } else {
                for (var i = 0; i < $scope.ObjectPosition.length; i++) {
                    if ($scope.ObjectPosition[i].index == $index && $scope.ObjectPosition[i].parent == $parentIndex) {
                        $scope.ObjectPosition.splice(i, 1);
                        return;
                    }
                }
            }
        } else {
            for (var i = 0; i < $scope.ObjectPosition.length; i++) {
                if ($scope.ObjectPosition[i].index == $index && $scope.ObjectPosition[i].parent == $parentIndex) {
                    for (var j = 0; j < $scope.formData.ShopList.length; j++) {
                        if ($scope.formData.ShopList[j].LOCAL_ID == $scope.ObjectPosition[i].ObjectGroup) {
                            $scope.SelectedShop = $scope.formData.ShopList[j];
                            break;
                        }
                    }
                    $scope.StartBlockState = false;
                    $scope.EndBlockState = false;
                    break;
                }
            }

            if ($scope.StartBlockState) {
                $scope.StartBlock = $parentIndex + ',' + $index;
                createBlock();
            } else if ($scope.EndBlockState) {
                $scope.EndBlock = $parentIndex + ',' + $index;
                createBlock();
            }
        }
    }

    $scope.dragOverPosition = function ($parentIndex, $index) {
        if ($scope.planMode == 0) {
            if ($scope.drawMode == 0) {
                for (var i = 0; i < $scope.ObjectPosition.length; i++) {
                    if ($scope.ObjectPosition[i].index == $index && $scope.ObjectPosition[i].parent == $parentIndex) {
                        return;
                    }
                }

                $scope.ObjectPosition.push({
                    parent: $parentIndex,
                    index: $index,
                    ObjectType: $scope.ObjectType,
                    ObjectGroup: 0
                });

            } else if ($scope.drawMode == 2) {
                for (var i = 0; i < $scope.ObjectPosition.length; i++) {
                    if ($scope.ObjectPosition[i].index == $index && $scope.ObjectPosition[i].parent == $parentIndex) {
                        $scope.ObjectPosition.splice(i, 1);
                        return;
                    }
                }
            }
        }
    }

    $scope.CheckActivePosition = function ($parentIndex, $index) {
        for (var i = 0; i < $scope.ObjectPosition.length; i++) {
            if ($scope.ObjectPosition[i].index == $index && $scope.ObjectPosition[i].parent == $parentIndex) {
                return $scope.ObjectPosition[i].ObjectType;
            }
        }

        return '-1';
    }

    $scope.handleDrop = function (item, bin) {
        $scope.dragOverPosition(bin.split(',')[0], bin.split(',')[1]);
    }

    $scope.uploadPlanImage = function () {

        var file = $scope.fileUpload;

        if (file == null)
            return;

        $scope.fileName = file.name;
        $scope.ListDetail = null;

        file.upload = Upload.upload({
            url: window.location.origin + EVENT_PATH + '/UploadPlanImage',
            data: { File: file, ID: $scope.formData.Event.EVENT_ID },
        });

        file.upload.then(function (res) {
            $timeout(function () {
                if (res.data.result == 500) {
                    BaseService.Message.alert("Please insert file.");
                } else if (res.data.result == 200) {
                    BaseService.Message.alert((res.data.data));
                } else {
                    $scope.formData.Event.PLAN_PATH = "/Upload/Event/Plan/" +
                        $scope.formData.Event.EVENT_ID + "/" +
                        $scope.fileName;
                    //BaseService.Message.alert("บันทึกข้อมูลสำเร็จ");
                    BaseService.Message.alert($scope.formData.Event.COVER_PATH);
                }
            })
        }, function (res) {
            if (res.status > 0) {
                $scope.errorMsg = res.status + ': ' + res.data;
                BaseService.Message.alert("Cannot upload file")
            }
        }, function (evt) {
            file.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
        });
    };

    $scope.calculateGrid = function () {

        var gridSize = 0;
        if ($scope.formData.Event.GRID_SIZE == 0) {
            $scope.gridWidth = '2px';
            $scope.gridHeight = '2px';
            gridSize = 0.5;
        } else {
            $scope.gridWidth = '5px';
            $scope.gridHeight = '5px';
            gridSize = 1;
        }

        if ($scope.formData.Event.WIDTH != null && $scope.formData.Event.WIDTH > 0) {
            $scope.gridColumn = $scope.formData.Event.WIDTH / gridSize;
            document.getElementById("PlanGrid").style.width = $scope.gridColumn + "px";
        }

        if ($scope.formData.Event.DEPTH != null && $scope.formData.Event.DEPTH > 0) {
            $scope.gridRow = $scope.formData.Event.DEPTH / gridSize;
            document.getElementById("PlanGrid").style.height = $scope.gridRow + "px";
        }
    }

    $scope.planSubmit = function () {
        let scopeData = $scope.formData.Event;
        let data = $.param(scopeData);

        BaseService.CallAction(EVENT_PATH, "SubmitPlan", data)
            .then(function (result) {
                //BaseService.Message.alert('บันทึกข้อมูลสำเร็จ');

            }, function (error) {
                BaseService.Message.alert('ไม่สามารถบันทึกข้อมูลได้');
                console.log('Unable to edit event data: ' + error.message)
            })

        var FoodTruckNumber = groupingObject();
        var error = false;
        for (var i = 1; i <= FoodTruckNumber; i++) {
            var _ft = $filter('filter')($scope.ObjectPosition, { 'ObjectGroup': i }, true)
            var _ftString = ''
            if (_ft.length > 0) {
                for (var j = 0; j < _ft.length; j++) {
                    _ftString += _ft[j].index + ',' + _ft[j].parent + '|'; 
                }
            }
            _ftString = _ftString.substring(0, _ftString.length - 1);

            if ($scope.formData.ShopList.length > 0) {
                var _shop = $filter('filter')($scope.formData.ShopList, { 'LOCAL_ID': i }, true);
                if (_shop.length > 0) {
                    $scope.formData.Shop = _shop[0];
                } else {
                    $scope.formData.Shop = {
                        LOCAL_ID: i,
                        EVENT_ID: $scope.formData.Event.EVENT_ID,
                        NAME: '',
                        PRICE: '',
                        DEPOSIT_FEE_RATE: '',
                        FT: _ftString,
                        BLOCK_ID: 0
                    };
                }
            } else {
                $scope.formData.Shop = {
                    LOCAL_ID: i,
                    EVENT_ID: $scope.formData.Event.EVENT_ID,
                    NAME: '',
                    PRICE: '',
                    DEPOSIT_FEE_RATE: '',
                    FT: _ftString,
                    BLOCK_ID: 0
                };
            }

            
            scopeData = $scope.formData.Shop;
            data = $.param(scopeData);
            BaseService.CallAction(EVENT_PATH, "SubmitPlanShop", data)
                .then(function (result) {
                }, function (error) {
                    error = true;
                    console.log('Unable to edit plan shop data: ' + error.message)
                })
        }
        if (error)
            BaseService.Message.alert('ไม่สามารถบันทึกข้อมูลจุดจอดได้');

        return FoodTruckNumber;
    }

    function groupingObject() {
        angular.forEach($scope.ObjectPosition, function (item) { item.ObjectGroup = 0; });
        var itemsSorted = $filter('orderBy')($scope.ObjectPosition, ['index', 'parent']);
        var FoodTruckNumber = 0;
        for (var i = 0; i < itemsSorted.length; i++) {
            var _ft = itemsSorted[i];
            var x = -1;
            for (var j = 1; j < $scope.gridColumn; j++) {
                var _ft2 = $filter('filter')(itemsSorted, { 'index': parseInt(_ft.index) + j, 'parent': parseInt(_ft.parent) }, true)
                if (_ft2.length > 0) {
                    if (_ft2[0].ObjectGroup != 0) {
                        x = _ft2[0].ObjectGroup;
                        break;
                    }
                } else {
                    break;
                }
            }

            for (var j = 1; j < $scope.gridColumn; j++) {
                var _ft2 = $filter('filter')(itemsSorted, { 'index': parseInt(_ft.index) - j, 'parent': parseInt(_ft.parent) }, true)
                if (_ft2.length > 0) {
                    if (_ft2[0].ObjectGroup != 0) {
                        x = _ft2[0].ObjectGroup;
                        break;
                    }
                } else {
                    break;
                }
            }

            for (var j = 1; j < $scope.gridRow; j++) {
                var _ft2 = $filter('filter')(itemsSorted, { 'index': parseInt(_ft.index) , 'parent': parseInt(_ft.parent) + j }, true)
                if (_ft2.length > 0) {
                    if (_ft2[0].ObjectGroup != 0) {
                        x = _ft2[0].ObjectGroup;
                        break;
                    }
                } else {
                    break;
                }
            }

            for (var j = 1; j < $scope.gridRow; j++) {
                var _ft2 = $filter('filter')(itemsSorted, { 'index': parseInt(_ft.index), 'parent': parseInt(_ft.parent) - j }, true)
                if (_ft2.length > 0) {
                    if (_ft2[0].ObjectGroup != 0) {
                        x = _ft2[0].ObjectGroup;
                        break;
                    }
                } else {
                    break;
                }
            }

            if (x == -1) {
                FoodTruckNumber++;
                _ft.ObjectGroup = FoodTruckNumber;
                for (var j = 1; j < $scope.gridColumn; j++) {
                    var _ft2 = $filter('filter')(itemsSorted, { 'index': parseInt(_ft.index) + j, 'parent': parseInt(_ft.parent) }, true)
                    if (_ft2.length > 0) {
                        if (_ft2[0].ObjectGroup == 0) {
                            _ft2[0].ObjectGroup = FoodTruckNumber;
                        }
                    } else {
                        break;
                    }
                }

                for (var j = 1; j < $scope.gridColumn; j++) {
                    var _ft2 = $filter('filter')(itemsSorted, { 'index': parseInt(_ft.index) - j, 'parent': parseInt(_ft.parent) }, true)
                    if (_ft2.length > 0) {
                        if (_ft2[0].ObjectGroup == 0) {
                            _ft2[0].ObjectGroup = FoodTruckNumber;
                        }
                    } else {
                        break;
                    }
                }

                for (var j = 1; j < $scope.gridRow; j++) {
                    var _ft2 = $filter('filter')(itemsSorted, { 'index': parseInt(_ft.index), 'parent': parseInt(_ft.parent) + j }, true)
                    if (_ft2.length > 0) {
                        if (_ft2[0].ObjectGroup == 0) {
                            _ft2[0].ObjectGroup = FoodTruckNumber;
                        }
                    } else {
                        break;
                    }
                }

                for (var j = 1; j < $scope.gridRow; j++) {
                    var _ft2 = $filter('filter')(itemsSorted, { 'index': parseInt(_ft.index), 'parent': parseInt(_ft.parent) - j }, true)
                    if (_ft2.length > 0) {
                        if (_ft2[0].ObjectGroup == 0) {
                            _ft2[0].ObjectGroup = FoodTruckNumber;
                        }
                    } else {
                        break;
                    }
                }
            } else {
                _ft.ObjectGroup = x;
            }
        }
        return FoodTruckNumber;
    }

    $scope.selectBlock = function () {
        var FoodTruckNumber = $scope.planSubmit();

        for (var i = 1; i <= FoodTruckNumber; i++) {
            var _ft = $filter('filter')($scope.ObjectPosition, { 'ObjectGroup': i }, true)
            var _ftString = ''
            if (_ft.length > 0) {
                for (var j = 0; j < _ft.length; j++) {
                    _ftString += _ft[j].index + ',' + _ft[j].parent + '|';
                }
            }
            _ftString = _ftString.substring(0, _ftString.length - 1);

            if ($scope.formData.ShopList.length > 0) {
                var _shop = $filter('filter')($scope.formData.ShopList, { 'LOCAL_ID': i }, true);
                if (_shop.length > 0) {
                    continue;
                } else {
                    $scope.formData.ShopList.push({
                        LOCAL_ID: i,
                        EVENT_ID: $scope.formData.Event.EVENT_ID,
                        NAME: '',
                        PRICE: '',
                        DEPOSIT_FEE_RATE: '',
                        FT: _ftString,
                        BLOCK_ID: 0
                    });
                }
            } else {
                $scope.formData.ShopList.push({
                    LOCAL_ID: i,
                    EVENT_ID: $scope.formData.Event.EVENT_ID,
                    NAME: '',
                    PRICE: '',
                    DEPOSIT_FEE_RATE: '',
                    FT: _ftString,
                    BLOCK_ID: 0
                });
            }
        }

        $scope.planMode = 1;
        document.getElementById("PlanGrid").style.border = "none";
        document.getElementById("PlanImage").style.display = "none";
    }

    $scope.StartSelectBlock = function () {
        $scope.StartBlockState = true;
        $scope.EndBlockState = false;
    }

    $scope.EndSelectBlock = function() {
        $scope.EndBlockState = true;
        $scope.StartBlockState = false;
    }

    function createBlock() {
        if ($scope.StartBlock != null && $scope.EndBlock != null) {

            for (var i = 0; i < $scope.gridRow; i++) {
                for (var j = 0; j < $scope.gridColumn; j++) {
                    document.getElementById(i + "," + j).classList.remove('activeFoodTruckGroup');
                }
            }

            var _sy = parseInt($scope.StartBlock.split(',')[0]);
            var _ey = parseInt($scope.EndBlock.split(',')[0]);
            var _sx = parseInt($scope.StartBlock.split(',')[1]);
            var _ex = parseInt($scope.EndBlock.split(',')[1]);

            if (_sy > _ey) {
                _sy = parseInt($scope.EndBlock.split(',')[0]);
                _ey = parseInt($scope.StartBlock.split(',')[0]);
            }

            if (_sx > _ex) {
                _sx = parseInt($scope.EndBlock.split(',')[1]);
                _ex = parseInt($scope.StartBlock.split(',')[1]);
            }

            for (var i = _sx; i <= _ex; i++) {
                document.getElementById(_sy + "," + parseInt(i)).classList.add('activeFoodTruckGroup');
            }

            for (var i = _sy; i <= _ey; i++) {
                document.getElementById(parseInt(i)  + "," + _sx).classList.add('activeFoodTruckGroup');
            }

            for (var i = _sx; i <= _ex; i++) {
                document.getElementById(_ey + "," + parseInt(i)).classList.add('activeFoodTruckGroup');
            }

            for (var i = _sy; i <= _ey; i++) {
                document.getElementById(parseInt(i) + "," + _ex).classList.add('activeFoodTruckGroup');
            }
            
            BaseService.Message.input('Please insert group number')
                .then(function (result) {
                    $scope.CurrentInsertGroup = result;
                });
        }
    }

    $scope.inviteFoodTruck = function () {
        if ($scope.SelectedShop.LOCAL_ID == null) {
            BaseService.Message.alert('Please select Position to invite');
            return;
        }

        if ($scope.formData.InviteFT.SHOP_ID == null) {
            BaseService.Message.alert('Please select Food Truck');
            return;
        }

        var EventDate = {
            'EVENT_ID': $scope.formData.Event.EVENT_ID,
            'SHOP_ID': $scope.formData.InviteFT.SHOP_ID,
            'LOCAL_ID': $scope.SelectedShop.LOCAL_ID
        };
        var scopeData = EventDate;
        data = $.param(scopeData);

        BaseService.CallAction(EVENT_PATH, "CheckInviteFoodTruck", data)
            .then(function (result) {
                if (result.length > 0) {
                    var EndDate = new Date($scope.formData.Event.END_DATE);
                    var StartDate = new Date($scope.formData.Event.START_DATE);
                    var timeDiff = Math.abs(EndDate.getTime() - StartDate.getTime());
                    var DayLength = Math.ceil(timeDiff / (1000 * 3600 * 24)) + 1;

                    for (var i = 0; i < DayLength; i++) {
                        var _date = new Date($scope.formData.Event.START_DATE);
                        _date.setDate(_date.getDate() + i);

                        var EventDate = {
                            'EVENT_ID': $scope.formData.Event.EVENT_ID,
                            'SHOP_ID': $scope.formData.InviteFT.SHOP_ID,
                            'LOCAL_ID': $scope.SelectedShop.LOCAL_ID,
                            'START_DATE': _date
                        };
                        var scopeData = EventDate;
                        data = $.param(scopeData);
                        BaseService.CallAction(EVENT_PATH, "InviteFoodTruck", data)
                            .then(function (result) {
                            }, function (error) {
                                error = true;
                                console.log('Unable to edit plan shop data: ' + error.message)
                            })
                    }
                } else {
                    BaseService.Message.confirm('Re-Invite new Foodtruck?')
                        .then(function () {
                            var EndDate = new Date($scope.formData.Event.END_DATE);
                            var StartDate = new Date($scope.formData.Event.START_DATE);
                            var timeDiff = Math.abs(EndDate.getTime() - StartDate.getTime());
                            var DayLength = Math.ceil(timeDiff / (1000 * 3600 * 24)) + 1;
                            for (var i = 0; i < DayLength; i++) {
                                var _date = new Date($scope.formData.Event.START_DATE);
                                _date.setDate(_date.getDate() + i);

                                var EventDate = {
                                    'EVENT_ID': $scope.formData.Event.EVENT_ID,
                                    'SHOP_ID': $scope.formData.InviteFT.SHOP_ID,
                                    'LOCAL_ID': $scope.SelectedShop.LOCAL_ID,
                                    'START_DATE': _date
                                };
                                var scopeData = EventDate;
                                data = $.param(scopeData);
                                BaseService.CallAction(EVENT_PATH, "InviteFoodTruck", data)
                                    .then(function (result) {
                                    }, function (error) {
                                        error = true;
                                        console.log('Unable to edit plan shop data: ' + error.message)
                                    })
                            }
                        });
                }
            }, function (error) {
                console.log('Unable to load event data: ' + error.message)
            })
    }

    $scope.$watch('CurrentInsertGroup', function (newVal, oldVal) {
        if (newVal != 0 && newVal != null) {
            $scope.CurrentInsertBlock = 0;
            setBlockNumber(newVal);
        }
    });

    function setBlockNumber(_num) {

        var _sy = parseInt($scope.StartBlock.split(',')[0]);
        var _ey = parseInt($scope.EndBlock.split(',')[0]);
        var _sx = parseInt($scope.StartBlock.split(',')[1]);
        var _ex = parseInt($scope.EndBlock.split(',')[1]);

        if (_sy > _ey) {
            _sy = parseInt($scope.EndBlock.split(',')[0]);
            _ey = parseInt($scope.StartBlock.split(',')[0]);
        }

        if (_sx > _ex) {
            _sx = parseInt($scope.EndBlock.split(',')[1]);
            _ex = parseInt($scope.StartBlock.split(',')[1]);
        }

        var itemsSorted = $filter('orderBy')($scope.ObjectPosition, ['index', 'parent']);
        for (var x = _sx; x <= _ex; x++) {
            for (var y = _sy; y <= _ey; y++) {
                var _ft = $filter('filter')(itemsSorted, { 'index': x, 'parent': y }, true)
                if (_ft.length > 0) {
                    for (var j = 0; j < $scope.formData.ShopList.length; j++) {
                        if ($scope.formData.ShopList[j].LOCAL_ID == _ft[0].ObjectGroup) {
                            $scope.formData.ShopList[j].BLOCK_ID = _num;
                            break;
                        }
                    }
                }
            }
        }
        
        $scope.StartBlock = null;
        $scope.EndBlock = null;
    }

    $scope.backToDrawPlan = function () {
        $scope.planMode = 0;
        document.getElementById("PlanGrid").style.border = "solid thin #000000";
        document.getElementById("PlanImage").style.display = "initial";

        for (var i = 0; i < $scope.gridRow; i++) {
            for (var j = 0; j < $scope.gridColumn; j++) {
                document.getElementById(i + "," + j).classList.remove('activeFoodTruckGroup');
            }
        }

        BaseService.CallAction(EVENT_PATH, "GetEvent", null)
            .then(function (result) {
                $scope.formData.Event = result[0];
                $scope.calculateGrid();
            }, function (error) {
                BaseService.Message.alert('ไม่สามารถบันทึกข้อมูลได้');
                console.log('Unable to edit event data: ' + error.message)
            })

        $scope.ObjectPosition = [];
        BaseService.CallAction(EVENT_PATH, "GetPlanShop", null)
            .then(function (result) {
                $scope.formData.Shop = result;
                for (var i = 0; i < $scope.formData.Shop.length; i++) {
                    var _ftString = $scope.formData.Shop[i].SHOP_POSITION;
                    var _ftSplit = _ftString.split("|");
                    for (var j = 0; j < _ftSplit.length; j++) {
                        $scope.ObjectPosition.push({
                            parent: parseInt(_ftSplit[j].split(",")[1]),
                            index: parseInt(_ftSplit[j].split(",")[0]),
                            ObjectType: 0,
                            ObjectGroup: 0
                        });
                    }
                }

            }, function (error) {
                BaseService.Message.alert('ไม่สามารถบันทึกข้อมูลได้');
                console.log('Unable to edit event data: ' + error.message)
            })
    }

    $scope.planBlockSubmit = function () {
        for (var i = 0; i < $scope.formData.ShopList.length; i++) {
            scopeData = $scope.formData.ShopList[i];
            data = $.param(scopeData);
            BaseService.CallAction(EVENT_PATH, "SubmitPlanShop", data)
                .then(function (result) {
                }, function (error) {
                    error = true;
                    console.log('Unable to edit plan shop data: ' + error.message)
                })
        }
    }

    $scope.calculateFTList = function () {
        $scope.planMode = 3;
        BaseService.CallAction(EVENT_PATH, "GetRegisterFT", null)
            .then(function (result) {
                $scope.RegisterShop = result;
            }, function (error) {
                BaseService.Message.alert('ไม่สามารถบันทึกข้อมูลได้');
                console.log('Unable to edit event data: ' + error.message)
            })

        BaseService.CallAction(EVENT_PATH, "GetRegisterFTCount", null)
            .then(function (result) {
                $scope.RegisterShopAmount = $filter('orderBy')(result, 'COUNTID', true);
                $scope.RegisterShopLength = $scope.RegisterShopAmount.length;
            }, function (error) {
                BaseService.Message.alert('ไม่สามารถบันทึกข้อมูลได้');
                console.log('Unable to edit event data: ' + error.message)
            })
        createNearList();
    }

    function createNearList() {
        var itemsSorted = $filter('orderBy')($scope.ObjectPosition, ['index', 'parent']);
        for (var i = 0; i < itemsSorted.length; i++) {
            var _ft = itemsSorted[i];
            for (var j = 12; j > 0; j--) {
                for (var k = 12 - j; k > 0; k--) {
                    var _ft2 = $filter('filter')(itemsSorted, { 'index': parseInt(_ft.index) + j, 'parent': parseInt(_ft.parent) + k }, true)
                    if (_ft2.length > 0 && _ft.ObjectGroup != _ft2[0].ObjectGroup) {
                        var _near = $filter('filter')($scope.NearList, { 'LOCAL_ID': _ft.ObjectGroup, 'NEAR_ID': _ft2[0].ObjectGroup }, true)
                        if (_near.length == 0) {
                            $scope.NearList.push({
                                'LOCAL_ID': _ft.ObjectGroup,
                                'NEAR_ID': _ft2[0].ObjectGroup
                            });
                            break;
                        }
                        break;
                    } 
                }
            }
        }
    }

    $scope.$watch('RegisterShopLength', function (newVal, oldVal) {
        if ($scope.RegisterShopLength != 0) {
            for (var i = 0; i < $scope.RegisterShopAmount.length; i++) {
                let scopeData = $scope.RegisterShopAmount[i];
                let data = $.param(scopeData);
                BaseService.CallAction(EVENT_PATH, "GetRegisterFTDislikeMenu", data)
                    .then(function (result) {
                        for (var x = 0; x < result.length; x++) {
                            if (result[x].EDIT)
                                $scope.ShopDislikeMenu.push(result[x]);
                        }
                    }, function (error) {
                        BaseService.Message.alert('ไม่สามารถบันทึกข้อมูลได้');
                        console.log('Unable to edit event data: ' + error.message)
                    })

                BaseService.CallAction(EVENT_PATH, "GetRegisterFTDislikeStyle", data)
                    .then(function (result) {
                        for (var x = 0; x < result.length; x++) {
                            if (result[x].EDIT)
                                $scope.ShopDislikeStyle.push(result[x]);
                        }
                    }, function (error) {
                        BaseService.Message.alert('ไม่สามารถบันทึกข้อมูลได้');
                        console.log('Unable to edit event data: ' + error.message)
                    })

                BaseService.CallAction(EVENT_PATH, "GetRegisterFTMenu", data)
                    .then(function (result) {
                        for (var x = 0; x < result.length; x++) {
                            $scope.ShopMenu.push(result[x]);
                        }
                        $scope.RegisterShopLength2++;
                    }, function (error) {
                        BaseService.Message.alert('ไม่สามารถบันทึกข้อมูลได้');
                        console.log('Unable to edit event data: ' + error.message)
                    })
            }
        }
    });

    $scope.$watchGroup(['RegisterShop', 'RegisterShopAmount', 'RegisterShopLength2'], function (newVal, oldVal, scope) {
        if ($scope.RegisterShop.length != 0 && $scope.RegisterShopAmount.length != 0
            && $scope.RegisterShopLength2 == $scope.RegisterShopLength && $scope.RegisterShopLength2 != 0) {
            console.log($scope.NearList);
            var EndDate = new Date($scope.formData.Event.END_DATE);
            var StartDate = new Date($scope.formData.Event.START_DATE);
            var timeDiff = Math.abs(EndDate.getTime() - StartDate.getTime());
            var DayLength = Math.ceil(timeDiff / (1000 * 3600 * 24)) + 1;

            var BLOCKID = 0;
            var shopSorted = $filter('orderBy')($scope.formData.ShopList, 'BLOCK_ID', false);
            for (var shopIndex = 0; shopIndex < shopSorted.length; shopIndex++) {
                if (BLOCKID == 0) {
                    BLOCKID = shopSorted[shopIndex].BLOCK_ID;
                    var shopInBlock = $filter('filter')($scope.formData.ShopList, { 'BLOCK_ID': BLOCKID }, true);
                    shopInBlock = $filter('orderBy')(shopInBlock, 'LOCAL_ID', false);
                    var mod = shopInBlock.length % 4;
                    if (mod < 2) {
                        CalculateDrinksModLess2(DayLength,shopInBlock);
                        CalculateSwSnLess2Right(DayLength, shopInBlock);
                        CalculateFoodModLess2(DayLength, shopInBlock);
                    } else {
                        CalculateDrinksModMore2(DayLength, shopInBlock);
                        CalculateSwSnMore2Right(DayLength, shopInBlock);
                        CalculateFoodModMore2(DayLength, shopInBlock);
                    }
                } else if (BLOCKID != shopSorted[shopIndex].BLOCK_ID) {
                    BLOCKID = shopSorted[shopIndex].BLOCK_ID;
                    var shopInBlock = $filter('filter')($scope.formData.ShopList, { 'BLOCK_ID': BLOCKID }, true);
                    shopInBlock = $filter('orderBy')(shopInBlock, 'LOCAL_ID', false);
                    var mod = shopInBlock.length % 4;
                    if (mod < 2) {
                        CalculateDrinksModLess2(DayLength, shopInBlock);
                        CalculateSwSnLess2Right(DayLength, shopInBlock);
                        CalculateFoodModLess2(DayLength, shopInBlock);
                    } else {
                        CalculateDrinksModMore2(DayLength, shopInBlock);
                        CalculateSwSnMore2Right(DayLength, shopInBlock);
                        CalculateFoodModMore2(DayLength, shopInBlock);
                    }
                }
            }

            if (DayLength <= 7) {
                $scope.TableWidth = 150 * DayLength;
                $scope.TableHeight = 150 * $scope.formData.ShopList.length;
            } else {
                $scope.TableWidth = 150 * (($scope.DayLength / 7) + 1);
                $scope.TableHeight = 150 * DayLength;
            }

            var shopSorted2 = $filter('orderBy')($scope.RegisterShop, 'LOCAL_ID', false);
            $scope.FTRegister = $scope.matrixList($filter('filter')(shopSorted2, { 'STATUS': 1 }, true), DayLength);
        }
    });

    function CalculateDrinksModLess2(DayLength,shopInBlock) {
        for (var i = 0; i < shopInBlock.length; i++) {
            var DayLength2 = DayLength;
            if ((i + 2) % 4 == 0) {
                for (var FTIndex = 0; FTIndex < $scope.RegisterShopAmount.length; FTIndex++) {
                    var FTMenuDrinks = $filter('filter')($scope.ShopMenu, { 'ITEM_TYPE_ID': 4, 'MAIN_ITEM': true, 'SHOP_ID': $scope.RegisterShopAmount[FTIndex].SHOP_ID }, true);
                    if (FTMenuDrinks.length > 0) {
                        var FTRegisterDate = $filter('filter')($scope.RegisterShop, { 'SHOP_ID': FTMenuDrinks[0].SHOP_ID, 'STATUS': 0 }, true);
                        var FTRegistered = $filter('filter')($scope.RegisterShop, { 'LOCAL_ID': shopInBlock[i].LOCAL_ID }, true);
                        for (var j = 0; j < FTRegisterDate.length; j++) {
                            var FTR = $filter('filter')(FTRegistered, { 'START_DATE': FTRegisterDate[j].START_DATE }, true);
                            if (FTR == null || FTR.length == 0) {
                                FTRegisterDate[j].LOCAL_ID = shopInBlock[i].LOCAL_ID;
                                FTRegisterDate[j].STATUS = 1;
                                DayLength2--;

                                if (DayLength2 == 0)
                                    break;
                            }
                        }
                        if (DayLength2 == 0)
                            break;
                    }
                }

                if (DayLength2 > 0) {
                    for (var FTIndex = 0; FTIndex < $scope.RegisterShopAmount.length; FTIndex++) {
                        var FTRegistered = $filter('filter')($scope.RegisterShop, { 'LOCAL_ID': shopInBlock[i].LOCAL_ID }, true);
                        var FTMenuDrinks = $filter('filter')($scope.ShopMenu, { 'ITEM_TYPE_ID': 4, 'MAIN_ITEM': true, 'SHOP_ID': $scope.RegisterShopAmount[FTIndex].SHOP_ID }, true);
                        if (FTMenuDrinks.length > 0) {
                            var FTRegisterDate = $filter('filter')($scope.RegisterShop, { 'SHOP_ID': FTMenuDrinks[0].SHOP_ID, 'STATUS': 0 }, true);
                            if (FTRegisterDate.length >= DayLength2) {
                                for (var j = 0; j < FTRegisterDate.length; j++) {
                                    var FTR = $filter('filter')(FTRegistered, { 'START_DATE': FTRegisterDate[j].START_DATE }, true);
                                    if (FTR == null || FTR.length == 0) {
                                        FTRegisterDate[j].LOCAL_ID = shopInBlock[i].LOCAL_ID;
                                        FTRegisterDate[j].STATUS = 1;
                                        DayLength2--;

                                        if (DayLength2 == 0)
                                            break;
                                    }
                                }
                            }
                            if (DayLength2 == 0)
                                break;
                        }
                    }
                }
            }
        }
    }

    function CalculateSwSnLess2Right(DayLength,shopInBlock) {
        var SwSn = 0;
        for (var i = 0; i < shopInBlock.length; i++) {
            var DayLength2 = DayLength;
            if ((i + 2) % 4 == 1) {
                for (var FTIndex = 0; FTIndex < $scope.RegisterShopAmount.length; FTIndex++) {
                    var FTRegistered = $filter('filter')($scope.RegisterShop, { 'LOCAL_ID': shopInBlock[i].LOCAL_ID }, true);
                    var FTMenuFood = $filter('filter')($scope.ShopMenu, { 'MAIN_ITEM': true, 'SHOP_ID': $scope.RegisterShopAmount[FTIndex].SHOP_ID }, true);
                    if (FTMenuFood != null && FTMenuFood.length > 0 && FTMenuFood[0].ITEM_TYPE_ID != 1 && FTMenuFood[0].ITEM_TYPE_ID != 4) {
                        var FTRegisterDate = $filter('filter')($scope.RegisterShop, { 'SHOP_ID': FTMenuFood[0].SHOP_ID, 'STATUS': 0 }, true);
                        for (var j = 0; j < FTRegisterDate.length; j++) {
                            var FTR = $filter('filter')(FTRegistered, { 'START_DATE': FTRegisterDate[j].START_DATE }, true);
                            if (FTR == null || FTR.length == 0) {
                                var FTDislike = $filter('filter')($scope.ShopDislikeMenu, { 'SHOP_ID': $scope.RegisterShopAmount[FTIndex].SHOP_ID }, true);
                                var FTDislikeStyle = $filter('filter')($scope.ShopDislikeStyle, { 'SHOP_ID': $scope.RegisterShopAmount[FTIndex].SHOP_ID }, true);
                                var _near = $filter('filter')($scope.NearList, { 'LOCAL_ID': shopInBlock[i].LOCAL_ID }, true);
                                var _near2 = $filter('filter')($scope.NearList, { 'NEAR_ID': shopInBlock[i].LOCAL_ID }, true);
                                var dislike = false;

                                if (_near.length > 0) {
                                    for (var _FT = 0; _FT < _near.length; _FT++) {
                                        var _nearFT = $filter('filter')($scope.RegisterShop, { 'LOCAL_ID': _near[_FT].NEAR_ID, 'START_DATE': FTRegisterDate[j].START_DATE }, true);
                                        if (_nearFT != null && _nearFT.length != 0) {
                                            for (var nId = 0; nId < _nearFT.length; nId++) {
                                                var FTMenuFood2 = $filter('filter')($scope.ShopMenu, { 'MAIN_ITEM': true, 'SHOP_ID': _nearFT[nId].SHOP_ID }, true);
                                                var FTDislike2 = $filter('filter')($scope.ShopDislikeMenu, { 'SHOP_ID': _nearFT[nId].SHOP_ID }, true);
                                                var FTDislikeStyle2 = $filter('filter')($scope.ShopDislikeStyle, { 'SHOP_ID': _nearFT[nId].SHOP_ID }, true);

                                                if (FTDislike.length > 0) {
                                                    for (var dId = 0; dId < FTDislike.length; dId++) {
                                                        for (var fId = 0; fId < FTMenuFood2.length; fId++) {
                                                            if (FTMenuFood2[fId].ITEM_MENU_ID == FTDislike[dId].ITEM_STYLE_ID) {
                                                                console.log($scope.RegisterShopAmount[FTIndex].SHOP_ID + 'Dislike Near' + _nearFT[nId].SHOP_ID)
                                                                dislike = true;
                                                                break;
                                                            }
                                                        }

                                                        if (dislike)
                                                            break;
                                                    }
                                                }

                                                if (dislike)
                                                    break;

                                                if (FTDislike2.length > 0) {
                                                    for (var dId = 0; dId < FTDislike2.length; dId++) {
                                                        for (var fId = 0; fId < FTMenuFood.length; fId++) {
                                                            if (FTMenuFood[fId].ITEM_MENU_ID == FTDislike2[dId].ITEM_STYLE_ID) {
                                                                console.log($scope.RegisterShopAmount[FTIndex].SHOP_ID + 'Dislike Near' + _nearFT[nId].SHOP_ID)
                                                                dislike = true;
                                                                break;
                                                            }
                                                        }

                                                        if (dislike)
                                                            break;
                                                    }
                                                }

                                                if (dislike)
                                                    break;

                                                if (FTDislikeStyle.length > 0) {
                                                    for (var dId = 0; dId < FTDislikeStyle.length; dId++) {
                                                        for (var fId = 0; fId < FTMenuFood2.length; fId++) {
                                                            if (FTMenuFood2[fId].ITEM_STYLE_ID == FTDislikeStyle[dId].ITEM_STYLE_ID) {
                                                                console.log($scope.RegisterShopAmount[FTIndex].SHOP_ID + 'Dislike Near' + _nearFT[nId].SHOP_ID)
                                                                dislike = true;
                                                                break;
                                                            }
                                                        }

                                                        if (dislike)
                                                            break;
                                                    }
                                                }

                                                if (dislike)
                                                    break;

                                                if (FTDislikeStyle2.length > 0) {
                                                    for (var dId = 0; dId < FTDislikeStyle2.length; dId++) {
                                                        for (var fId = 0; fId < FTMenuFood.length; fId++) {
                                                            if (FTMenuFood[fId].ITEM_STYLE_ID == FTDislikeStyle2[dId].ITEM_STYLE_ID) {
                                                                console.log($scope.RegisterShopAmount[FTIndex].SHOP_ID + 'Dislike Near' + _nearFT[nId].SHOP_ID)
                                                                dislike = true;
                                                                break;
                                                            }
                                                        }

                                                        if (dislike)
                                                            break;
                                                    }
                                                }

                                                if (dislike)
                                                    break;
                                            }
                                        }
                                    }
                                }
                                
                                if (_near2.length > 0) {
                                    for (var _FT = 0; _FT < _near2.length; _FT++) {
                                        var _nearFT = $filter('filter')($scope.RegisterShop, { 'LOCAL_ID': _near2[_FT].LOCAL_ID, 'START_DATE': FTRegisterDate[j].START_DATE }, true);
                                        if (_nearFT != null && _nearFT.length != 0) {
                                            for (var nId = 0; nId < _nearFT.length; nId++) {
                                                var FTMenuFood2 = $filter('filter')($scope.ShopMenu, { 'MAIN_ITEM': true, 'SHOP_ID': _nearFT[nId].SHOP_ID }, true);
                                                var FTDislike2 = $filter('filter')($scope.ShopDislikeMenu, { 'SHOP_ID': _nearFT[nId].SHOP_ID }, true);
                                                var FTDislikeStyle2 = $filter('filter')($scope.ShopDislikeStyle, { 'SHOP_ID': _nearFT[nId].SHOP_ID }, true);

                                                if (FTDislike.length > 0) {
                                                    for (var dId = 0; dId < FTDislike.length; dId++) {
                                                        for (var fId = 0; fId < FTMenuFood2.length; fId++) {
                                                            if (FTMenuFood2[fId].ITEM_MENU_ID == FTDislike[dId].ITEM_STYLE_ID) {
                                                                console.log($scope.RegisterShopAmount[FTIndex].SHOP_ID + 'Dislike Near' + _nearFT[nId].SHOP_ID)
                                                                dislike = true;
                                                                break;
                                                            }
                                                        }

                                                        if (dislike)
                                                            break;
                                                    }
                                                }

                                                if (dislike)
                                                    break;

                                                if (FTDislike2.length > 0) {
                                                    for (var dId = 0; dId < FTDislike2.length; dId++) {
                                                        for (var fId = 0; fId < FTMenuFood.length; fId++) {
                                                            if (FTMenuFood[fId].ITEM_MENU_ID == FTDislike2[dId].ITEM_STYLE_ID) {
                                                                console.log($scope.RegisterShopAmount[FTIndex].SHOP_ID + 'Dislike Near' + _nearFT[nId].SHOP_ID)
                                                                dislike = true;
                                                                break;
                                                            }
                                                        }

                                                        if (dislike)
                                                            break;
                                                    }
                                                }

                                                if (dislike)
                                                    break;

                                                if (FTDislikeStyle.length > 0) {
                                                    for (var dId = 0; dId < FTDislikeStyle.length; dId++) {
                                                        for (var fId = 0; fId < FTMenuFood2.length; fId++) {
                                                            if (FTMenuFood2[fId].ITEM_STYLE_ID == FTDislikeStyle[dId].ITEM_STYLE_ID) {
                                                                console.log($scope.RegisterShopAmount[FTIndex].SHOP_ID + 'Dislike Near' + _nearFT[nId].SHOP_ID)
                                                                dislike = true;
                                                                break;
                                                            }
                                                        }

                                                        if (dislike)
                                                            break;
                                                    }
                                                }

                                                if (dislike)
                                                    break;

                                                if (FTDislikeStyle2.length > 0) {
                                                    for (var dId = 0; dId < FTDislikeStyle2.length; dId++) {
                                                        for (var fId = 0; fId < FTMenuFood.length; fId++) {
                                                            if (FTMenuFood[fId].ITEM_STYLE_ID == FTDislikeStyle2[dId].ITEM_STYLE_ID) {
                                                                console.log($scope.RegisterShopAmount[FTIndex].SHOP_ID + 'Dislike Near' + _nearFT[nId].SHOP_ID)
                                                                dislike = true;
                                                                break;
                                                            }
                                                        }

                                                        if (dislike)
                                                            break;
                                                    }
                                                }

                                                if (dislike)
                                                    break;
                                            }
                                        }
                                    }
                                }

                                if (!dislike) {
                                    FTRegisterDate[j].LOCAL_ID = shopInBlock[i].LOCAL_ID;
                                    FTRegisterDate[j].STATUS = 1;
                                    DayLength2--;
                                } 

                                if (DayLength2 == 0) {
                                    SwSn++;
                                    break;
                                }
                            }
                        }
                        if (DayLength2 == 0)
                            break;
                    }
                }

                if (SwSn > shopInBlock.length / 2)
                    break;
            }
        }

        if (SwSn < shopInBlock.length / 2) {
            CalculateSwSnLess2Left(DayLength, shopInBlock, SwSn);
        }
    }

    function CalculateSwSnLess2Left(DayLength, shopInBlock, SwSn) {
        for (var i = 0; i < shopInBlock.length; i++) {
            var DayLength2 = DayLength;
            if ((i + 2) % 4 == 3) {
                for (var FTIndex = 0; FTIndex < $scope.RegisterShopAmount.length; FTIndex++) {
                    var FTRegistered = $filter('filter')($scope.RegisterShop, { 'LOCAL_ID': shopInBlock[i].LOCAL_ID }, true);
                    var FTMenuFood = $filter('filter')($scope.ShopMenu, { 'MAIN_ITEM': true, 'SHOP_ID': $scope.RegisterShopAmount[FTIndex].SHOP_ID }, true);
                    if (FTMenuFood != null && FTMenuFood.length > 0 && FTMenuFood[0].ITEM_TYPE_ID != 1 && FTMenuFood[0].ITEM_TYPE_ID != 4) {
                        var FTRegisterDate = $filter('filter')($scope.RegisterShop, { 'SHOP_ID': FTMenuFood[0].SHOP_ID, 'STATUS': 0 }, true);
                        for (var j = 0; j < FTRegisterDate.length; j++) {
                            var FTR = $filter('filter')(FTRegistered, { 'START_DATE': FTRegisterDate[j].START_DATE }, true);
                            if (FTR == null || FTR.length == 0) {
                                var FTDislike = $filter('filter')($scope.ShopDislikeMenu, { 'SHOP_ID': $scope.RegisterShopAmount[FTIndex].SHOP_ID }, true);
                                var FTDislikeStyle = $filter('filter')($scope.ShopDislikeStyle, { 'SHOP_ID': $scope.RegisterShopAmount[FTIndex].SHOP_ID }, true);
                                var _near = $filter('filter')($scope.NearList, { 'LOCAL_ID': shopInBlock[i].LOCAL_ID }, true);
                                var _near2 = $filter('filter')($scope.NearList, { 'NEAR_ID': shopInBlock[i].LOCAL_ID }, true);
                                var dislike = false;

                                if (_near.length > 0) {
                                    for (var _FT = 0; _FT < _near.length; _FT++) {
                                        var _nearFT = $filter('filter')($scope.RegisterShop, { 'LOCAL_ID': _near[_FT].NEAR_ID, 'START_DATE': FTRegisterDate[j].START_DATE }, true);
                                        if (_nearFT != null && _nearFT.length != 0) {
                                            for (var nId = 0; nId < _nearFT.length; nId++) {
                                                var FTMenuFood2 = $filter('filter')($scope.ShopMenu, { 'MAIN_ITEM': true, 'SHOP_ID': _nearFT[nId].SHOP_ID }, true);
                                                var FTDislike2 = $filter('filter')($scope.ShopDislikeMenu, { 'SHOP_ID': _nearFT[nId].SHOP_ID }, true);
                                                var FTDislikeStyle2 = $filter('filter')($scope.ShopDislikeStyle, { 'SHOP_ID': _nearFT[nId].SHOP_ID }, true);

                                                if (FTDislike.length > 0) {
                                                    for (var dId = 0; dId < FTDislike.length; dId++) {
                                                        for (var fId = 0; fId < FTMenuFood2.length; fId++) {
                                                            if (FTMenuFood2[fId].ITEM_MENU_ID == FTDislike[dId].ITEM_STYLE_ID) {
                                                                console.log($scope.RegisterShopAmount[FTIndex].SHOP_ID + 'Dislike Near' + _nearFT[nId].SHOP_ID)
                                                                dislike = true;
                                                                break;
                                                            }
                                                        }

                                                        if (dislike)
                                                            break;
                                                    }
                                                }

                                                if (dislike)
                                                    break;

                                                if (FTDislike2.length > 0) {
                                                    for (var dId = 0; dId < FTDislike2.length; dId++) {
                                                        for (var fId = 0; fId < FTMenuFood.length; fId++) {
                                                            if (FTMenuFood[fId].ITEM_MENU_ID == FTDislike2[dId].ITEM_STYLE_ID) {
                                                                console.log($scope.RegisterShopAmount[FTIndex].SHOP_ID + 'Dislike Near' + _nearFT[nId].SHOP_ID)
                                                                dislike = true;
                                                                break;
                                                            }
                                                        }

                                                        if (dislike)
                                                            break;
                                                    }
                                                }

                                                if (dislike)
                                                    break;

                                                if (FTDislikeStyle.length > 0) {
                                                    for (var dId = 0; dId < FTDislikeStyle.length; dId++) {
                                                        for (var fId = 0; fId < FTMenuFood2.length; fId++) {
                                                            if (FTMenuFood2[fId].ITEM_STYLE_ID == FTDislikeStyle[dId].ITEM_STYLE_ID) {
                                                                console.log($scope.RegisterShopAmount[FTIndex].SHOP_ID + 'Dislike Near' + _nearFT[nId].SHOP_ID)
                                                                dislike = true;
                                                                break;
                                                            }
                                                        }

                                                        if (dislike)
                                                            break;
                                                    }
                                                }

                                                if (dislike)
                                                    break;

                                                if (FTDislikeStyle2.length > 0) {
                                                    for (var dId = 0; dId < FTDislikeStyle2.length; dId++) {
                                                        for (var fId = 0; fId < FTMenuFood.length; fId++) {
                                                            if (FTMenuFood[fId].ITEM_STYLE_ID == FTDislikeStyle2[dId].ITEM_STYLE_ID) {
                                                                console.log($scope.RegisterShopAmount[FTIndex].SHOP_ID + 'Dislike Near' + _nearFT[nId].SHOP_ID)
                                                                dislike = true;
                                                                break;
                                                            }
                                                        }

                                                        if (dislike)
                                                            break;
                                                    }
                                                }

                                                if (dislike)
                                                    break;
                                            }
                                        }
                                    }
                                }

                                if (_near2.length > 0) {
                                    for (var _FT = 0; _FT < _near2.length; _FT++) {
                                        var _nearFT = $filter('filter')($scope.RegisterShop, { 'LOCAL_ID': _near2[_FT].LOCAL_ID, 'START_DATE': FTRegisterDate[j].START_DATE }, true);
                                        if (_nearFT != null && _nearFT.length != 0) {
                                            for (var nId = 0; nId < _nearFT.length; nId++) {
                                                var FTMenuFood2 = $filter('filter')($scope.ShopMenu, { 'MAIN_ITEM': true, 'SHOP_ID': _nearFT[nId].SHOP_ID }, true);
                                                var FTDislike2 = $filter('filter')($scope.ShopDislikeMenu, { 'SHOP_ID': _nearFT[nId].SHOP_ID }, true);
                                                var FTDislikeStyle2 = $filter('filter')($scope.ShopDislikeStyle, { 'SHOP_ID': _nearFT[nId].SHOP_ID }, true);

                                                if (FTDislike.length > 0) {
                                                    for (var dId = 0; dId < FTDislike.length; dId++) {
                                                        for (var fId = 0; fId < FTMenuFood2.length; fId++) {
                                                            if (FTMenuFood2[fId].ITEM_MENU_ID == FTDislike[dId].ITEM_STYLE_ID) {
                                                                console.log($scope.RegisterShopAmount[FTIndex].SHOP_ID + 'Dislike Near' + _nearFT[nId].SHOP_ID)
                                                                dislike = true;
                                                                break;
                                                            }
                                                        }

                                                        if (dislike)
                                                            break;
                                                    }
                                                }

                                                if (dislike)
                                                    break;

                                                if (FTDislike2.length > 0) {
                                                    for (var dId = 0; dId < FTDislike2.length; dId++) {
                                                        for (var fId = 0; fId < FTMenuFood.length; fId++) {
                                                            if (FTMenuFood[fId].ITEM_MENU_ID == FTDislike2[dId].ITEM_STYLE_ID) {
                                                                console.log($scope.RegisterShopAmount[FTIndex].SHOP_ID + 'Dislike Near' + _nearFT[nId].SHOP_ID)
                                                                dislike = true;
                                                                break;
                                                            }
                                                        }

                                                        if (dislike)
                                                            break;
                                                    }
                                                }

                                                if (dislike)
                                                    break;

                                                if (FTDislikeStyle.length > 0) {
                                                    for (var dId = 0; dId < FTDislikeStyle.length; dId++) {
                                                        for (var fId = 0; fId < FTMenuFood2.length; fId++) {
                                                            if (FTMenuFood2[fId].ITEM_STYLE_ID == FTDislikeStyle[dId].ITEM_STYLE_ID) {
                                                                console.log($scope.RegisterShopAmount[FTIndex].SHOP_ID + 'Dislike Near' + _nearFT[nId].SHOP_ID)
                                                                dislike = true;
                                                                break;
                                                            }
                                                        }

                                                        if (dislike)
                                                            break;
                                                    }
                                                }

                                                if (dislike)
                                                    break;

                                                if (FTDislikeStyle2.length > 0) {
                                                    for (var dId = 0; dId < FTDislikeStyle2.length; dId++) {
                                                        for (var fId = 0; fId < FTMenuFood.length; fId++) {
                                                            if (FTMenuFood[fId].ITEM_STYLE_ID == FTDislikeStyle2[dId].ITEM_STYLE_ID) {
                                                                console.log($scope.RegisterShopAmount[FTIndex].SHOP_ID + 'Dislike Near' + _nearFT[nId].SHOP_ID)
                                                                dislike = true;
                                                                break;
                                                            }
                                                        }

                                                        if (dislike)
                                                            break;
                                                    }
                                                }

                                                if (dislike)
                                                    break;
                                            }
                                        }
                                    }
                                }

                                if (!dislike) {
                                    FTRegisterDate[j].LOCAL_ID = shopInBlock[i].LOCAL_ID;
                                    FTRegisterDate[j].STATUS = 1;
                                    DayLength2--;
                                }

                                if (DayLength2 == 0) {
                                    SwSn++;
                                    break;
                                }
                            }
                        }
                        if (DayLength2 == 0)
                            break;
                    }
                }

                if (SwSn > shopInBlock.length / 2)
                    break;
            }

            if (SwSn > shopInBlock.length / 2)
                break;
        }
    }

    function CalculateFoodModLess2(DayLength, shopInBlock) {
        for (var i = 0; i < shopInBlock.length; i++) {

            var FTRegisteredDate = $filter('filter')($scope.RegisterShop, { 'LOCAL_ID': shopInBlock[i].LOCAL_ID, 'STATUS': 1 }, true);
            if (FTRegisteredDate.length >= DayLength)
                continue;

            var DayLength2 = DayLength;

            if ((i + 2) % 4 != 0) {
                for (var FTIndex = 0; FTIndex < $scope.RegisterShopAmount.length; FTIndex++) {
                    var FTRegistered = $filter('filter')($scope.RegisterShop, { 'LOCAL_ID': shopInBlock[i].LOCAL_ID }, true);
                    var FTMenuFood = $filter('filter')($scope.ShopMenu, { 'ITEM_TYPE_ID': 1, 'MAIN_ITEM': true, 'SHOP_ID': $scope.RegisterShopAmount[FTIndex].SHOP_ID }, true);
                    if (FTMenuFood != null && FTMenuFood.length > 0) {
                        var FTRegisterDate = $filter('filter')($scope.RegisterShop, { 'SHOP_ID': FTMenuFood[0].SHOP_ID, 'STATUS': 0 }, true);
                        for (var j = 0; j < FTRegisterDate.length; j++) {
                            var FTR = $filter('filter')(FTRegistered, { 'START_DATE': FTRegisterDate[j].START_DATE }, true);
                            if (FTR == null || FTR.length == 0) {
                                var FTDislike = $filter('filter')($scope.ShopDislikeMenu, { 'SHOP_ID': $scope.RegisterShopAmount[FTIndex].SHOP_ID }, true);
                                var FTDislikeStyle = $filter('filter')($scope.ShopDislikeStyle, { 'SHOP_ID': $scope.RegisterShopAmount[FTIndex].SHOP_ID }, true);
                                var _near = $filter('filter')($scope.NearList, { 'LOCAL_ID': shopInBlock[i].LOCAL_ID }, true);
                                var _near2 = $filter('filter')($scope.NearList, { 'NEAR_ID': shopInBlock[i].LOCAL_ID }, true);
                                var dislike = false;

                                if (_near.length > 0) {
                                    for (var _FT = 0; _FT < _near.length; _FT++) {
                                        var _nearFT = $filter('filter')($scope.RegisterShop, { 'LOCAL_ID': _near[_FT].NEAR_ID, 'START_DATE': FTRegisterDate[j].START_DATE }, true);
                                        if (_nearFT != null && _nearFT.length != 0) {
                                            for (var nId = 0; nId < _nearFT.length; nId++) {
                                                var FTMenuFood2 = $filter('filter')($scope.ShopMenu, { 'MAIN_ITEM': true, 'SHOP_ID': _nearFT[nId].SHOP_ID }, true);
                                                var FTDislike2 = $filter('filter')($scope.ShopDislikeMenu, { 'SHOP_ID': _nearFT[nId].SHOP_ID }, true);
                                                var FTDislikeStyle2 = $filter('filter')($scope.ShopDislikeStyle, { 'SHOP_ID': _nearFT[nId].SHOP_ID }, true);

                                                if (FTDislike.length > 0) {
                                                    for (var dId = 0; dId < FTDislike.length; dId++) {
                                                        for (var fId = 0; fId < FTMenuFood2.length; fId++) {
                                                            if (FTMenuFood2[fId].ITEM_MENU_ID == FTDislike[dId].ITEM_STYLE_ID) {
                                                                console.log($scope.RegisterShopAmount[FTIndex].SHOP_ID + 'Dislike Near' + _nearFT[nId].SHOP_ID)
                                                                dislike = true;
                                                                break;
                                                            }
                                                        }

                                                        if (dislike)
                                                            break;
                                                    }
                                                }

                                                if (dislike)
                                                    break;

                                                if (FTDislike2.length > 0) {
                                                    for (var dId = 0; dId < FTDislike2.length; dId++) {
                                                        for (var fId = 0; fId < FTMenuFood.length; fId++) {
                                                            if (FTMenuFood[fId].ITEM_MENU_ID == FTDislike2[dId].ITEM_STYLE_ID) {
                                                                console.log($scope.RegisterShopAmount[FTIndex].SHOP_ID + 'Dislike Near' + _nearFT[nId].SHOP_ID)
                                                                dislike = true;
                                                                break;
                                                            }
                                                        }

                                                        if (dislike)
                                                            break;
                                                    }
                                                }

                                                if (dislike)
                                                    break;

                                                if (FTDislikeStyle.length > 0) {
                                                    for (var dId = 0; dId < FTDislikeStyle.length; dId++) {
                                                        for (var fId = 0; fId < FTMenuFood2.length; fId++) {
                                                            if (FTMenuFood2[fId].ITEM_STYLE_ID == FTDislikeStyle[dId].ITEM_STYLE_ID) {
                                                                console.log($scope.RegisterShopAmount[FTIndex].SHOP_ID + 'Dislike Near' + _nearFT[nId].SHOP_ID)
                                                                dislike = true;
                                                                break;
                                                            }
                                                        }

                                                        if (dislike)
                                                            break;
                                                    }
                                                }

                                                if (dislike)
                                                    break;

                                                if (FTDislikeStyle2.length > 0) {
                                                    for (var dId = 0; dId < FTDislikeStyle2.length; dId++) {
                                                        for (var fId = 0; fId < FTMenuFood.length; fId++) {
                                                            if (FTMenuFood[fId].ITEM_STYLE_ID == FTDislikeStyle2[dId].ITEM_STYLE_ID) {
                                                                console.log($scope.RegisterShopAmount[FTIndex].SHOP_ID + 'Dislike Near' + _nearFT[nId].SHOP_ID)
                                                                dislike = true;
                                                                break;
                                                            }
                                                        }

                                                        if (dislike)
                                                            break;
                                                    }
                                                }

                                                if (dislike)
                                                    break;
                                            }
                                        }
                                    }
                                }

                                if (_near2.length > 0) {
                                    for (var _FT = 0; _FT < _near2.length; _FT++) {
                                        var _nearFT = $filter('filter')($scope.RegisterShop, { 'LOCAL_ID': _near2[_FT].LOCAL_ID, 'START_DATE': FTRegisterDate[j].START_DATE }, true);
                                        if (_nearFT != null && _nearFT.length != 0) {
                                            for (var nId = 0; nId < _nearFT.length; nId++) {
                                                var FTMenuFood2 = $filter('filter')($scope.ShopMenu, { 'MAIN_ITEM': true, 'SHOP_ID': _nearFT[nId].SHOP_ID }, true);
                                                var FTDislike2 = $filter('filter')($scope.ShopDislikeMenu, { 'SHOP_ID': _nearFT[nId].SHOP_ID }, true);
                                                var FTDislikeStyle2 = $filter('filter')($scope.ShopDislikeStyle, { 'SHOP_ID': _nearFT[nId].SHOP_ID }, true);

                                                if (FTDislike.length > 0) {
                                                    for (var dId = 0; dId < FTDislike.length; dId++) {
                                                        for (var fId = 0; fId < FTMenuFood2.length; fId++) {
                                                            if (FTMenuFood2[fId].ITEM_MENU_ID == FTDislike[dId].ITEM_STYLE_ID) {
                                                                console.log($scope.RegisterShopAmount[FTIndex].SHOP_ID + 'Dislike Near' + _nearFT[nId].SHOP_ID)
                                                                dislike = true;
                                                                break;
                                                            }
                                                        }

                                                        if (dislike)
                                                            break;
                                                    }
                                                }

                                                if (dislike)
                                                    break;

                                                if (FTDislike2.length > 0) {
                                                    for (var dId = 0; dId < FTDislike2.length; dId++) {
                                                        for (var fId = 0; fId < FTMenuFood.length; fId++) {
                                                            if (FTMenuFood[fId].ITEM_MENU_ID == FTDislike2[dId].ITEM_STYLE_ID) {
                                                                console.log($scope.RegisterShopAmount[FTIndex].SHOP_ID + 'Dislike Near' + _nearFT[nId].SHOP_ID)
                                                                dislike = true;
                                                                break;
                                                            }
                                                        }

                                                        if (dislike)
                                                            break;
                                                    }
                                                }

                                                if (dislike)
                                                    break;

                                                if (FTDislikeStyle.length > 0) {
                                                    for (var dId = 0; dId < FTDislikeStyle.length; dId++) {
                                                        for (var fId = 0; fId < FTMenuFood2.length; fId++) {
                                                            if (FTMenuFood2[fId].ITEM_STYLE_ID == FTDislikeStyle[dId].ITEM_STYLE_ID) {
                                                                console.log($scope.RegisterShopAmount[FTIndex].SHOP_ID + 'Dislike Near' + _nearFT[nId].SHOP_ID)
                                                                dislike = true;
                                                                break;
                                                            }
                                                        }

                                                        if (dislike)
                                                            break;
                                                    }
                                                }

                                                if (dislike)
                                                    break;

                                                if (FTDislikeStyle2.length > 0) {
                                                    for (var dId = 0; dId < FTDislikeStyle2.length; dId++) {
                                                        for (var fId = 0; fId < FTMenuFood.length; fId++) {
                                                            if (FTMenuFood[fId].ITEM_STYLE_ID == FTDislikeStyle2[dId].ITEM_STYLE_ID) {
                                                                console.log($scope.RegisterShopAmount[FTIndex].SHOP_ID + 'Dislike Near' + _nearFT[nId].SHOP_ID)
                                                                dislike = true;
                                                                break;
                                                            }
                                                        }

                                                        if (dislike)
                                                            break;
                                                    }
                                                }

                                                if (dislike)
                                                    break;
                                            }
                                        }
                                    }
                                }

                                if (!dislike) {
                                    FTRegisterDate[j].LOCAL_ID = shopInBlock[i].LOCAL_ID;
                                    FTRegisterDate[j].STATUS = 1;
                                    DayLength2--;
                                }
                            }
                        }
                        if (DayLength2 == 0)
                            break;
                    }
                }
            }
        }
    }

    function CalculateDrinksModMore2(DayLength, shopInBlock) {
        for (var i = 0; i < shopInBlock.length; i++) {
            var DayLength2 = DayLength;
            if ((i + 3) % 4 == 0) {
                for (var FTIndex = 0; FTIndex < $scope.RegisterShopAmount.length; FTIndex++) {
                    var FTMenuDrinks = $filter('filter')($scope.ShopMenu, { 'ITEM_TYPE_ID': 4, 'MAIN_ITEM': true, 'SHOP_ID': $scope.RegisterShopAmount[FTIndex].SHOP_ID }, true);
                    if (FTMenuDrinks.length > 0) {
                        var FTRegisterDate = $filter('filter')($scope.RegisterShop, { 'SHOP_ID': FTMenuDrinks[0].SHOP_ID, 'STATUS': 0 }, true);
                        var FTRegistered = $filter('filter')($scope.RegisterShop, { 'LOCAL_ID': shopInBlock[i].LOCAL_ID }, true);
                        for (var j = 0; j < FTRegisterDate.length; j++) {
                            var FTR = $filter('filter')(FTRegistered, { 'START_DATE': FTRegisterDate[j].START_DATE }, true);
                            if (FTR == null || FTR.length == 0) {
                                FTRegisterDate[j].LOCAL_ID = shopInBlock[i].LOCAL_ID;
                                FTRegisterDate[j].STATUS = 1;
                                DayLength2--;

                                if (DayLength2 == 0)
                                    break;
                            }
                        }
                        if (DayLength2 == 0)
                            break;
                    }
                }

                if (DayLength2 > 0) {
                    for (var FTIndex = 0; FTIndex < $scope.RegisterShopAmount.length; FTIndex++) {
                        var FTRegistered = $filter('filter')($scope.RegisterShop, { 'LOCAL_ID': shopInBlock[i].LOCAL_ID }, true);
                        var FTMenuDrinks = $filter('filter')($scope.ShopMenu, { 'ITEM_TYPE_ID': 4, 'MAIN_ITEM': true, 'SHOP_ID': $scope.RegisterShopAmount[FTIndex].SHOP_ID }, true);
                        if (FTMenuDrinks.length > 0) {
                            var FTRegisterDate = $filter('filter')($scope.RegisterShop, { 'SHOP_ID': FTMenuDrinks[0].SHOP_ID, 'STATUS': 0 }, true);
                            if (FTRegisterDate.length >= DayLength2) {
                                for (var j = 0; j < FTRegisterDate.length; j++) {
                                    var FTR = $filter('filter')(FTRegistered, { 'START_DATE': FTRegisterDate[j].START_DATE }, true);
                                    if (FTR == null || FTR.length == 0) {
                                        FTRegisterDate[j].LOCAL_ID = shopInBlock[i].LOCAL_ID;
                                        FTRegisterDate[j].STATUS = 1;
                                        DayLength2--;

                                        if (DayLength2 == 0)
                                            break;
                                    }
                                }
                            }
                            if (DayLength2 == 0)
                                break;
                        }
                    }
                }
            }
        }
    }

    function CalculateSwSnMore2Right(DayLength, shopInBlock) {
        var SwSn = 0;
        for (var i = 0; i < shopInBlock.length; i++) {
            var DayLength2 = DayLength;
            if ((i + 3) % 4 == 1) {
                for (var FTIndex = 0; FTIndex < $scope.RegisterShopAmount.length; FTIndex++) {
                    var FTRegistered = $filter('filter')($scope.RegisterShop, { 'LOCAL_ID': shopInBlock[i].LOCAL_ID }, true);
                    var FTMenuFood = $filter('filter')($scope.ShopMenu, { 'MAIN_ITEM': true, 'SHOP_ID': $scope.RegisterShopAmount[FTIndex].SHOP_ID }, true);
                    if (FTMenuFood != null && FTMenuFood.length > 0 && FTMenuFood[0].ITEM_TYPE_ID != 1 && FTMenuFood[0].ITEM_TYPE_ID != 4) {
                        var FTRegisterDate = $filter('filter')($scope.RegisterShop, { 'SHOP_ID': FTMenuFood[0].SHOP_ID, 'STATUS': 0 }, true);
                        for (var j = 0; j < FTRegisterDate.length; j++) {
                            var FTR = $filter('filter')(FTRegistered, { 'START_DATE': FTRegisterDate[j].START_DATE }, true);
                            if (FTR == null || FTR.length == 0) {
                                var FTDislike = $filter('filter')($scope.ShopDislikeMenu, { 'SHOP_ID': $scope.RegisterShopAmount[FTIndex].SHOP_ID }, true);
                                var FTDislikeStyle = $filter('filter')($scope.ShopDislikeStyle, { 'SHOP_ID': $scope.RegisterShopAmount[FTIndex].SHOP_ID }, true);
                                var _near = $filter('filter')($scope.NearList, { 'LOCAL_ID': shopInBlock[i].LOCAL_ID }, true);
                                var _near2 = $filter('filter')($scope.NearList, { 'NEAR_ID': shopInBlock[i].LOCAL_ID }, true);
                                var dislike = false;

                                if (_near.length > 0) {
                                    for (var _FT = 0; _FT < _near.length; _FT++) {
                                        var _nearFT = $filter('filter')($scope.RegisterShop, { 'LOCAL_ID': _near[_FT].NEAR_ID, 'START_DATE': FTRegisterDate[j].START_DATE }, true);
                                        if (_nearFT != null && _nearFT.length != 0) {
                                            for (var nId = 0; nId < _nearFT.length; nId++) {
                                                var FTMenuFood2 = $filter('filter')($scope.ShopMenu, { 'MAIN_ITEM': true, 'SHOP_ID': _nearFT[nId].SHOP_ID }, true);
                                                var FTDislike2 = $filter('filter')($scope.ShopDislikeMenu, { 'SHOP_ID': _nearFT[nId].SHOP_ID }, true);
                                                var FTDislikeStyle2 = $filter('filter')($scope.ShopDislikeStyle, { 'SHOP_ID': _nearFT[nId].SHOP_ID }, true);

                                                if (FTDislike.length > 0) {
                                                    for (var dId = 0; dId < FTDislike.length; dId++) {
                                                        for (var fId = 0; fId < FTMenuFood2.length; fId++) {
                                                            if (FTMenuFood2[fId].ITEM_MENU_ID == FTDislike[dId].ITEM_STYLE_ID) {
                                                                console.log($scope.RegisterShopAmount[FTIndex].SHOP_ID + 'Dislike Near' + _nearFT[nId].SHOP_ID)
                                                                dislike = true;
                                                                break;
                                                            }
                                                        }

                                                        if (dislike)
                                                            break;
                                                    }
                                                }

                                                if (dislike)
                                                    break;

                                                if (FTDislike2.length > 0) {
                                                    for (var dId = 0; dId < FTDislike2.length; dId++) {
                                                        for (var fId = 0; fId < FTMenuFood.length; fId++) {
                                                            if (FTMenuFood[fId].ITEM_MENU_ID == FTDislike2[dId].ITEM_STYLE_ID) {
                                                                console.log($scope.RegisterShopAmount[FTIndex].SHOP_ID + 'Dislike Near' + _nearFT[nId].SHOP_ID)
                                                                dislike = true;
                                                                break;
                                                            }
                                                        }

                                                        if (dislike)
                                                            break;
                                                    }
                                                }

                                                if (dislike)
                                                    break;

                                                if (FTDislikeStyle.length > 0) {
                                                    for (var dId = 0; dId < FTDislikeStyle.length; dId++) {
                                                        for (var fId = 0; fId < FTMenuFood2.length; fId++) {
                                                            if (FTMenuFood2[fId].ITEM_STYLE_ID == FTDislikeStyle[dId].ITEM_STYLE_ID) {
                                                                console.log($scope.RegisterShopAmount[FTIndex].SHOP_ID + 'Dislike Near' + _nearFT[nId].SHOP_ID)
                                                                dislike = true;
                                                                break;
                                                            }
                                                        }

                                                        if (dislike)
                                                            break;
                                                    }
                                                }

                                                if (dislike)
                                                    break;

                                                if (FTDislikeStyle2.length > 0) {
                                                    for (var dId = 0; dId < FTDislikeStyle2.length; dId++) {
                                                        for (var fId = 0; fId < FTMenuFood.length; fId++) {
                                                            if (FTMenuFood[fId].ITEM_STYLE_ID == FTDislikeStyle2[dId].ITEM_STYLE_ID) {
                                                                console.log($scope.RegisterShopAmount[FTIndex].SHOP_ID + 'Dislike Near' + _nearFT[nId].SHOP_ID)
                                                                dislike = true;
                                                                break;
                                                            }
                                                        }

                                                        if (dislike)
                                                            break;
                                                    }
                                                }

                                                if (dislike)
                                                    break;
                                            }
                                        }
                                    }
                                }

                                if (_near2.length > 0) {
                                    for (var _FT = 0; _FT < _near2.length; _FT++) {
                                        var _nearFT = $filter('filter')($scope.RegisterShop, { 'LOCAL_ID': _near2[_FT].LOCAL_ID, 'START_DATE': FTRegisterDate[j].START_DATE }, true);
                                        if (_nearFT != null && _nearFT.length != 0) {
                                            for (var nId = 0; nId < _nearFT.length; nId++) {
                                                var FTMenuFood2 = $filter('filter')($scope.ShopMenu, { 'MAIN_ITEM': true, 'SHOP_ID': _nearFT[nId].SHOP_ID }, true);
                                                var FTDislike2 = $filter('filter')($scope.ShopDislikeMenu, { 'SHOP_ID': _nearFT[nId].SHOP_ID }, true);
                                                var FTDislikeStyle2 = $filter('filter')($scope.ShopDislikeStyle, { 'SHOP_ID': _nearFT[nId].SHOP_ID }, true);

                                                if (FTDislike.length > 0) {
                                                    for (var dId = 0; dId < FTDislike.length; dId++) {
                                                        for (var fId = 0; fId < FTMenuFood2.length; fId++) {
                                                            if (FTMenuFood2[fId].ITEM_MENU_ID == FTDislike[dId].ITEM_STYLE_ID) {
                                                                console.log($scope.RegisterShopAmount[FTIndex].SHOP_ID + 'Dislike Near' + _nearFT[nId].SHOP_ID)
                                                                dislike = true;
                                                                break;
                                                            }
                                                        }

                                                        if (dislike)
                                                            break;
                                                    }
                                                }

                                                if (dislike)
                                                    break;

                                                if (FTDislike2.length > 0) {
                                                    for (var dId = 0; dId < FTDislike2.length; dId++) {
                                                        for (var fId = 0; fId < FTMenuFood.length; fId++) {
                                                            if (FTMenuFood[fId].ITEM_MENU_ID == FTDislike2[dId].ITEM_STYLE_ID) {
                                                                console.log($scope.RegisterShopAmount[FTIndex].SHOP_ID + 'Dislike Near' + _nearFT[nId].SHOP_ID)
                                                                dislike = true;
                                                                break;
                                                            }
                                                        }

                                                        if (dislike)
                                                            break;
                                                    }
                                                }

                                                if (dislike)
                                                    break;

                                                if (FTDislikeStyle.length > 0) {
                                                    for (var dId = 0; dId < FTDislikeStyle.length; dId++) {
                                                        for (var fId = 0; fId < FTMenuFood2.length; fId++) {
                                                            if (FTMenuFood2[fId].ITEM_STYLE_ID == FTDislikeStyle[dId].ITEM_STYLE_ID) {
                                                                console.log($scope.RegisterShopAmount[FTIndex].SHOP_ID + 'Dislike Near' + _nearFT[nId].SHOP_ID)
                                                                dislike = true;
                                                                break;
                                                            }
                                                        }

                                                        if (dislike)
                                                            break;
                                                    }
                                                }

                                                if (dislike)
                                                    break;

                                                if (FTDislikeStyle2.length > 0) {
                                                    for (var dId = 0; dId < FTDislikeStyle2.length; dId++) {
                                                        for (var fId = 0; fId < FTMenuFood.length; fId++) {
                                                            if (FTMenuFood[fId].ITEM_STYLE_ID == FTDislikeStyle2[dId].ITEM_STYLE_ID) {
                                                                console.log($scope.RegisterShopAmount[FTIndex].SHOP_ID + 'Dislike Near' + _nearFT[nId].SHOP_ID)
                                                                dislike = true;
                                                                break;
                                                            }
                                                        }

                                                        if (dislike)
                                                            break;
                                                    }
                                                }

                                                if (dislike)
                                                    break;
                                            }
                                        }
                                    }
                                }

                                if (!dislike) {
                                    FTRegisterDate[j].LOCAL_ID = shopInBlock[i].LOCAL_ID;
                                    FTRegisterDate[j].STATUS = 1;
                                    DayLength2--;
                                }

                                if (DayLength2 == 0) {
                                    SwSn++;
                                    break;
                                }
                            }
                        }
                        if (DayLength2 == 0)
                            break;
                    }
                }

                if (SwSn > shopInBlock.length / 2)
                    break;
            }

            if (SwSn > shopInBlock.length / 2)
                break;
        }

        if (SwSn < shopInBlock.length / 2) {
            CalculateSwSnMore2Left(DayLength, shopInBlock, SwSn);
        }
    }

    function CalculateSwSnMore2Left(DayLength, shopInBlock, SwSn) {
        for (var i = 0; i < shopInBlock.length; i++) {
            var DayLength2 = DayLength;
            if ((i + 3) % 4 == 3) {
                for (var FTIndex = 0; FTIndex < $scope.RegisterShopAmount.length; FTIndex++) {
                    var FTRegistered = $filter('filter')($scope.RegisterShop, { 'LOCAL_ID': shopInBlock[i].LOCAL_ID }, true);
                    var FTMenuFood = $filter('filter')($scope.ShopMenu, { 'MAIN_ITEM': true, 'SHOP_ID': $scope.RegisterShopAmount[FTIndex].SHOP_ID }, true);
                    if (FTMenuFood != null && FTMenuFood.length > 0 && FTMenuFood[0].ITEM_TYPE_ID != 1 && FTMenuFood[0].ITEM_TYPE_ID != 4) {
                        var FTRegisterDate = $filter('filter')($scope.RegisterShop, { 'SHOP_ID': FTMenuFood[0].SHOP_ID, 'STATUS': 0 }, true);
                        for (var j = 0; j < FTRegisterDate.length; j++) {
                            var FTR = $filter('filter')(FTRegistered, { 'START_DATE': FTRegisterDate[j].START_DATE }, true);
                            if (FTR == null || FTR.length == 0) {
                                var FTDislike = $filter('filter')($scope.ShopDislikeMenu, { 'SHOP_ID': $scope.RegisterShopAmount[FTIndex].SHOP_ID }, true);
                                var FTDislikeStyle = $filter('filter')($scope.ShopDislikeStyle, { 'SHOP_ID': $scope.RegisterShopAmount[FTIndex].SHOP_ID }, true);
                                var _near = $filter('filter')($scope.NearList, { 'LOCAL_ID': shopInBlock[i].LOCAL_ID }, true);
                                var _near2 = $filter('filter')($scope.NearList, { 'NEAR_ID': shopInBlock[i].LOCAL_ID }, true);
                                var dislike = false;

                                if (_near.length > 0) {
                                    for (var _FT = 0; _FT < _near.length; _FT++) {
                                        var _nearFT = $filter('filter')($scope.RegisterShop, { 'LOCAL_ID': _near[_FT].NEAR_ID, 'START_DATE': FTRegisterDate[j].START_DATE }, true);
                                        if (_nearFT != null && _nearFT.length != 0) {
                                            for (var nId = 0; nId < _nearFT.length; nId++) {
                                                var FTMenuFood2 = $filter('filter')($scope.ShopMenu, { 'MAIN_ITEM': true, 'SHOP_ID': _nearFT[nId].SHOP_ID }, true);
                                                var FTDislike2 = $filter('filter')($scope.ShopDislikeMenu, { 'SHOP_ID': _nearFT[nId].SHOP_ID }, true);
                                                var FTDislikeStyle2 = $filter('filter')($scope.ShopDislikeStyle, { 'SHOP_ID': _nearFT[nId].SHOP_ID }, true);

                                                if (FTDislike.length > 0) {
                                                    for (var dId = 0; dId < FTDislike.length; dId++) {
                                                        for (var fId = 0; fId < FTMenuFood2.length; fId++) {
                                                            if (FTMenuFood2[fId].ITEM_MENU_ID == FTDislike[dId].ITEM_STYLE_ID) {
                                                                console.log($scope.RegisterShopAmount[FTIndex].SHOP_ID + 'Dislike Near' + _nearFT[nId].SHOP_ID)
                                                                dislike = true;
                                                                break;
                                                            }
                                                        }

                                                        if (dislike)
                                                            break;
                                                    }
                                                }

                                                if (dislike)
                                                    break;

                                                if (FTDislike2.length > 0) {
                                                    for (var dId = 0; dId < FTDislike2.length; dId++) {
                                                        for (var fId = 0; fId < FTMenuFood.length; fId++) {
                                                            if (FTMenuFood[fId].ITEM_MENU_ID == FTDislike2[dId].ITEM_STYLE_ID) {
                                                                console.log($scope.RegisterShopAmount[FTIndex].SHOP_ID + 'Dislike Near' + _nearFT[nId].SHOP_ID)
                                                                dislike = true;
                                                                break;
                                                            }
                                                        }

                                                        if (dislike)
                                                            break;
                                                    }
                                                }

                                                if (dislike)
                                                    break;

                                                if (FTDislikeStyle.length > 0) {
                                                    for (var dId = 0; dId < FTDislikeStyle.length; dId++) {
                                                        for (var fId = 0; fId < FTMenuFood2.length; fId++) {
                                                            if (FTMenuFood2[fId].ITEM_STYLE_ID == FTDislikeStyle[dId].ITEM_STYLE_ID) {
                                                                console.log($scope.RegisterShopAmount[FTIndex].SHOP_ID + 'Dislike Near' + _nearFT[nId].SHOP_ID)
                                                                dislike = true;
                                                                break;
                                                            }
                                                        }

                                                        if (dislike)
                                                            break;
                                                    }
                                                }

                                                if (dislike)
                                                    break;

                                                if (FTDislikeStyle2.length > 0) {
                                                    for (var dId = 0; dId < FTDislikeStyle2.length; dId++) {
                                                        for (var fId = 0; fId < FTMenuFood.length; fId++) {
                                                            if (FTMenuFood[fId].ITEM_STYLE_ID == FTDislikeStyle2[dId].ITEM_STYLE_ID) {
                                                                console.log($scope.RegisterShopAmount[FTIndex].SHOP_ID + 'Dislike Near' + _nearFT[nId].SHOP_ID)
                                                                dislike = true;
                                                                break;
                                                            }
                                                        }

                                                        if (dislike)
                                                            break;
                                                    }
                                                }

                                                if (dislike)
                                                    break;
                                            }
                                        }
                                    }
                                }

                                if (_near2.length > 0) {
                                    for (var _FT = 0; _FT < _near2.length; _FT++) {
                                        var _nearFT = $filter('filter')($scope.RegisterShop, { 'LOCAL_ID': _near2[_FT].LOCAL_ID, 'START_DATE': FTRegisterDate[j].START_DATE }, true);
                                        if (_nearFT != null && _nearFT.length != 0) {
                                            for (var nId = 0; nId < _nearFT.length; nId++) {
                                                var FTMenuFood2 = $filter('filter')($scope.ShopMenu, { 'MAIN_ITEM': true, 'SHOP_ID': _nearFT[nId].SHOP_ID }, true);
                                                var FTDislike2 = $filter('filter')($scope.ShopDislikeMenu, { 'SHOP_ID': _nearFT[nId].SHOP_ID }, true);
                                                var FTDislikeStyle2 = $filter('filter')($scope.ShopDislikeStyle, { 'SHOP_ID': _nearFT[nId].SHOP_ID }, true);

                                                if (FTDislike.length > 0) {
                                                    for (var dId = 0; dId < FTDislike.length; dId++) {
                                                        for (var fId = 0; fId < FTMenuFood2.length; fId++) {
                                                            if (FTMenuFood2[fId].ITEM_MENU_ID == FTDislike[dId].ITEM_STYLE_ID) {
                                                                console.log($scope.RegisterShopAmount[FTIndex].SHOP_ID + 'Dislike Near' + _nearFT[nId].SHOP_ID)
                                                                dislike = true;
                                                                break;
                                                            }
                                                        }

                                                        if (dislike)
                                                            break;
                                                    }
                                                }

                                                if (dislike)
                                                    break;

                                                if (FTDislike2.length > 0) {
                                                    for (var dId = 0; dId < FTDislike2.length; dId++) {
                                                        for (var fId = 0; fId < FTMenuFood.length; fId++) {
                                                            if (FTMenuFood[fId].ITEM_MENU_ID == FTDislike2[dId].ITEM_STYLE_ID) {
                                                                console.log($scope.RegisterShopAmount[FTIndex].SHOP_ID + 'Dislike Near' + _nearFT[nId].SHOP_ID)
                                                                dislike = true;
                                                                break;
                                                            }
                                                        }

                                                        if (dislike)
                                                            break;
                                                    }
                                                }

                                                if (dislike)
                                                    break;

                                                if (FTDislikeStyle.length > 0) {
                                                    for (var dId = 0; dId < FTDislikeStyle.length; dId++) {
                                                        for (var fId = 0; fId < FTMenuFood2.length; fId++) {
                                                            if (FTMenuFood2[fId].ITEM_STYLE_ID == FTDislikeStyle[dId].ITEM_STYLE_ID) {
                                                                console.log($scope.RegisterShopAmount[FTIndex].SHOP_ID + 'Dislike Near' + _nearFT[nId].SHOP_ID)
                                                                dislike = true;
                                                                break;
                                                            }
                                                        }

                                                        if (dislike)
                                                            break;
                                                    }
                                                }

                                                if (dislike)
                                                    break;

                                                if (FTDislikeStyle2.length > 0) {
                                                    for (var dId = 0; dId < FTDislikeStyle2.length; dId++) {
                                                        for (var fId = 0; fId < FTMenuFood.length; fId++) {
                                                            if (FTMenuFood[fId].ITEM_STYLE_ID == FTDislikeStyle2[dId].ITEM_STYLE_ID) {
                                                                console.log($scope.RegisterShopAmount[FTIndex].SHOP_ID + 'Dislike Near' + _nearFT[nId].SHOP_ID)
                                                                dislike = true;
                                                                break;
                                                            }
                                                        }

                                                        if (dislike)
                                                            break;
                                                    }
                                                }

                                                if (dislike)
                                                    break;
                                            }
                                        }
                                    }
                                }

                                if (!dislike) {
                                    FTRegisterDate[j].LOCAL_ID = shopInBlock[i].LOCAL_ID;
                                    FTRegisterDate[j].STATUS = 1;
                                    DayLength2--;
                                }

                                if (DayLength2 == 0) {
                                    SwSn++;
                                    break;
                                }
                            }
                        }
                        if (DayLength2 == 0)
                            break;
                    }
                }

                if (SwSn > shopInBlock.length / 2)
                    break;
            }

            if (SwSn > shopInBlock.length / 2)
                break;
        }
    }

    function CalculateFoodModMore2(DayLength, shopInBlock) {
        for (var i = 0; i < shopInBlock.length; i++) {

            var FTRegisteredDate = $filter('filter')($scope.RegisterShop, { 'LOCAL_ID': shopInBlock[i].LOCAL_ID, 'STATUS': 1 }, true);
            if (FTRegisteredDate.length >= DayLength)
                continue;

            var DayLength2 = DayLength;

            if ((i + 3) % 4 != 0) {
                for (var FTIndex = 0; FTIndex < $scope.RegisterShopAmount.length; FTIndex++) {
                    var FTRegistered = $filter('filter')($scope.RegisterShop, { 'LOCAL_ID': shopInBlock[i].LOCAL_ID }, true);
                    var FTMenuFood = $filter('filter')($scope.ShopMenu, { 'ITEM_TYPE_ID': 1, 'MAIN_ITEM': true, 'SHOP_ID': $scope.RegisterShopAmount[FTIndex].SHOP_ID }, true);
                    if (FTMenuFood != null && FTMenuFood.length > 0) {
                        var FTRegisterDate = $filter('filter')($scope.RegisterShop, { 'SHOP_ID': FTMenuFood[0].SHOP_ID, 'STATUS': 0 }, true);
                        for (var j = 0; j < FTRegisterDate.length; j++) {
                            var FTR = $filter('filter')(FTRegistered, { 'START_DATE': FTRegisterDate[j].START_DATE }, true);
                            if (FTR == null || FTR.length == 0) {
                                var FTDislike = $filter('filter')($scope.ShopDislikeMenu, { 'SHOP_ID': $scope.RegisterShopAmount[FTIndex].SHOP_ID }, true);
                                var FTDislikeStyle = $filter('filter')($scope.ShopDislikeStyle, { 'SHOP_ID': $scope.RegisterShopAmount[FTIndex].SHOP_ID }, true);
                                var _near = $filter('filter')($scope.NearList, { 'LOCAL_ID': shopInBlock[i].LOCAL_ID }, true);
                                var _near2 = $filter('filter')($scope.NearList, { 'NEAR_ID': shopInBlock[i].LOCAL_ID }, true);
                                var dislike = false;

                                if (_near.length > 0) {
                                    for (var _FT = 0; _FT < _near.length; _FT++) {
                                        var _nearFT = $filter('filter')($scope.RegisterShop, { 'LOCAL_ID': _near[_FT].NEAR_ID, 'START_DATE': FTRegisterDate[j].START_DATE }, true);
                                        if (_nearFT != null && _nearFT.length != 0) {
                                            for (var nId = 0; nId < _nearFT.length; nId++) {
                                                var FTMenuFood2 = $filter('filter')($scope.ShopMenu, { 'MAIN_ITEM': true, 'SHOP_ID': _nearFT[nId].SHOP_ID }, true);
                                                var FTDislike2 = $filter('filter')($scope.ShopDislikeMenu, { 'SHOP_ID': _nearFT[nId].SHOP_ID }, true);
                                                var FTDislikeStyle2 = $filter('filter')($scope.ShopDislikeStyle, { 'SHOP_ID': _nearFT[nId].SHOP_ID }, true);

                                                if (FTDislike.length > 0) {
                                                    for (var dId = 0; dId < FTDislike.length; dId++) {
                                                        for (var fId = 0; fId < FTMenuFood2.length; fId++) {
                                                            if (FTMenuFood2[fId].ITEM_MENU_ID == FTDislike[dId].ITEM_STYLE_ID) {
                                                                console.log($scope.RegisterShopAmount[FTIndex].SHOP_ID + 'Dislike Near' + _nearFT[nId].SHOP_ID)
                                                                dislike = true;
                                                                break;
                                                            }
                                                        }

                                                        if (dislike)
                                                            break;
                                                    }
                                                }

                                                if (dislike)
                                                    break;

                                                if (FTDislike2.length > 0) {
                                                    for (var dId = 0; dId < FTDislike2.length; dId++) {
                                                        for (var fId = 0; fId < FTMenuFood.length; fId++) {
                                                            if (FTMenuFood[fId].ITEM_MENU_ID == FTDislike2[dId].ITEM_STYLE_ID) {
                                                                console.log($scope.RegisterShopAmount[FTIndex].SHOP_ID + 'Dislike Near' + _nearFT[nId].SHOP_ID)
                                                                dislike = true;
                                                                break;
                                                            }
                                                        }

                                                        if (dislike)
                                                            break;
                                                    }
                                                }

                                                if (dislike)
                                                    break;

                                                if (FTDislikeStyle.length > 0) {
                                                    for (var dId = 0; dId < FTDislikeStyle.length; dId++) {
                                                        for (var fId = 0; fId < FTMenuFood2.length; fId++) {
                                                            if (FTMenuFood2[fId].ITEM_STYLE_ID == FTDislikeStyle[dId].ITEM_STYLE_ID) {
                                                                console.log($scope.RegisterShopAmount[FTIndex].SHOP_ID + 'Dislike Near' + _nearFT[nId].SHOP_ID)
                                                                dislike = true;
                                                                break;
                                                            }
                                                        }

                                                        if (dislike)
                                                            break;
                                                    }
                                                }

                                                if (dislike)
                                                    break;

                                                if (FTDislikeStyle2.length > 0) {
                                                    for (var dId = 0; dId < FTDislikeStyle2.length; dId++) {
                                                        for (var fId = 0; fId < FTMenuFood.length; fId++) {
                                                            if (FTMenuFood[fId].ITEM_STYLE_ID == FTDislikeStyle2[dId].ITEM_STYLE_ID) {
                                                                console.log($scope.RegisterShopAmount[FTIndex].SHOP_ID + 'Dislike Near' + _nearFT[nId].SHOP_ID)
                                                                dislike = true;
                                                                break;
                                                            }
                                                        }

                                                        if (dislike)
                                                            break;
                                                    }
                                                }

                                                if (dislike)
                                                    break;
                                            }
                                        }
                                    }
                                }

                                if (_near2.length > 0) {
                                    for (var _FT = 0; _FT < _near2.length; _FT++) {
                                        var _nearFT = $filter('filter')($scope.RegisterShop, { 'LOCAL_ID': _near2[_FT].LOCAL_ID, 'START_DATE': FTRegisterDate[j].START_DATE }, true);
                                        if (_nearFT != null && _nearFT.length != 0) {
                                            for (var nId = 0; nId < _nearFT.length; nId++) {
                                                var FTMenuFood2 = $filter('filter')($scope.ShopMenu, { 'MAIN_ITEM': true, 'SHOP_ID': _nearFT[nId].SHOP_ID }, true);
                                                var FTDislike2 = $filter('filter')($scope.ShopDislikeMenu, { 'SHOP_ID': _nearFT[nId].SHOP_ID }, true);
                                                var FTDislikeStyle2 = $filter('filter')($scope.ShopDislikeStyle, { 'SHOP_ID': _nearFT[nId].SHOP_ID }, true);

                                                if (FTDislike.length > 0) {
                                                    for (var dId = 0; dId < FTDislike.length; dId++) {
                                                        for (var fId = 0; fId < FTMenuFood2.length; fId++) {
                                                            if (FTMenuFood2[fId].ITEM_MENU_ID == FTDislike[dId].ITEM_STYLE_ID) {
                                                                console.log($scope.RegisterShopAmount[FTIndex].SHOP_ID + 'Dislike Near' + _nearFT[nId].SHOP_ID)
                                                                dislike = true;
                                                                break;
                                                            }
                                                        }

                                                        if (dislike)
                                                            break;
                                                    }
                                                }

                                                if (dislike)
                                                    break;

                                                if (FTDislike2.length > 0) {
                                                    for (var dId = 0; dId < FTDislike2.length; dId++) {
                                                        for (var fId = 0; fId < FTMenuFood.length; fId++) {
                                                            if (FTMenuFood[fId].ITEM_MENU_ID == FTDislike2[dId].ITEM_STYLE_ID) {
                                                                console.log($scope.RegisterShopAmount[FTIndex].SHOP_ID + 'Dislike Near' + _nearFT[nId].SHOP_ID)
                                                                dislike = true;
                                                                break;
                                                            }
                                                        }

                                                        if (dislike)
                                                            break;
                                                    }
                                                }

                                                if (dislike)
                                                    break;

                                                if (FTDislikeStyle.length > 0) {
                                                    for (var dId = 0; dId < FTDislikeStyle.length; dId++) {
                                                        for (var fId = 0; fId < FTMenuFood2.length; fId++) {
                                                            if (FTMenuFood2[fId].ITEM_STYLE_ID == FTDislikeStyle[dId].ITEM_STYLE_ID) {
                                                                console.log($scope.RegisterShopAmount[FTIndex].SHOP_ID + 'Dislike Near' + _nearFT[nId].SHOP_ID)
                                                                dislike = true;
                                                                break;
                                                            }
                                                        }

                                                        if (dislike)
                                                            break;
                                                    }
                                                }

                                                if (dislike)
                                                    break;

                                                if (FTDislikeStyle2.length > 0) {
                                                    for (var dId = 0; dId < FTDislikeStyle2.length; dId++) {
                                                        for (var fId = 0; fId < FTMenuFood.length; fId++) {
                                                            if (FTMenuFood[fId].ITEM_STYLE_ID == FTDislikeStyle2[dId].ITEM_STYLE_ID) {
                                                                console.log($scope.RegisterShopAmount[FTIndex].SHOP_ID + 'Dislike Near' + _nearFT[nId].SHOP_ID)
                                                                dislike = true;
                                                                break;
                                                            }
                                                        }

                                                        if (dislike)
                                                            break;
                                                    }
                                                }

                                                if (dislike)
                                                    break;
                                            }
                                        }
                                    }
                                }

                                if (!dislike) {
                                    FTRegisterDate[j].LOCAL_ID = shopInBlock[i].LOCAL_ID;
                                    FTRegisterDate[j].STATUS = 1;
                                    DayLength2--;
                                }
                            }
                        }
                        if (DayLength2 == 0)
                            break;
                    }
                }
            }
        }
    }

    $scope.matrixList = function (data, n) {
        var grid = [], i = 0, x = data.length, col, row = -1;
        var StartDate = new Date($scope.formData.Event.START_DATE);
        var _day = [];
        for (var i = 0; i < n; i++) {
            var newdate = new Date(StartDate);
            newdate.setDate(newdate.getDate() + i);
            _day.push(newdate);
        }

        for (var i = 0; i < $scope.formData.ShopList.length; i++) {
            grid[i] = [];
        }

        for (var i = 0; i < x; i++) {
            var newdate = new Date(data[i].START_DATE);
            for (var j = 0; j < n; j++) {
                if (newdate.getDate() == _day[j].getDate()) {
                    col = j;
                    break;
                }
            }
            grid[data[i].LOCAL_ID - 1][col] = data[i];
        }
        return grid;
    };

    $scope.submitSchedule = function () {
        for (var i = 0; i < $scope.RegisterShop.length; i++) {
            scopeData = $scope.RegisterShop[i];
            data = $.param(scopeData);
            BaseService.CallAction(EVENT_PATH, "SubmitSchedule", data)
                .then(function (result) {
                }, function (error) {
                    error = true;
                    console.log('Unable to edit plan shop data: ' + error.message)
                })
        }
    }
})