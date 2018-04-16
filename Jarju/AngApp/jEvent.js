app.controller﻿("EventDisplayController", function ($scope, $http, BaseService, EVENT_PATH, Upload, $timeout) {

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

app.controller﻿("FloorPlanController", function ($scope, $http, BaseService, EVENT_PATH, Upload, $timeout, $filter) {

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
                }

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
        } else if ($scope.planMode == 1) {
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

            $scope.formData.Shop = {
                LOCAL_ID: i,
                EVENT_ID: $scope.formData.Event.EVENT_ID,
                NAME: '',
                PRICE: '',
                DEPOSIT_FEE_RATE: '',
                FT: _ftString,
                BLOCK_ID: 0
            };
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
        
        $scope.StartGroup = null;
        $scope.EndGroup = null;
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
})