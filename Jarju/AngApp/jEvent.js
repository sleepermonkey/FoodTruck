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

app.controller﻿("FloorPlanController", function ($scope, $http, BaseService, OPERATION_PATH, $timeout) {

    Opening();

    function Opening() {
        $scope.drawMode = 0;
        $scope.ObjectType = 0;
        $scope.ObjectOrientation = 0;
        $scope.ObjectWidth = 5;
        $scope.ObjectDepth = 2;
        $scope.selectedPosition = []
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
        if ($scope.drawMode == 1) {
            for (var i = 0; i < $scope.ObjectDepth; i++) {
                for (var j = 0; j < $scope.ObjectWidth; j++) {
                    document.getElementById(parseInt($parentIndex + i) + "," + parseInt($index + j)).classList.add('activeOver');
                }
            }
        } else {
            document.getElementById($parentIndex + "," + $index).classList.add('activeOver');
        }
    }

    $scope.mouseLeavePosition = function ($parentIndex, $index) {
        if ($scope.drawMode == 1) {
            for (var i = 0; i < $scope.ObjectDepth; i++) {
                for (var j = 0; j < $scope.ObjectWidth; j++) {
                    document.getElementById(parseInt($parentIndex + i) + "," + parseInt($index + j)).classList.remove('activeOver');
                }
            }
        } else {
            document.getElementById($parentIndex + "," + $index).classList.remove('activeOver');
        }
    }

    $scope.selectPosition = function ($parentIndex, $index) {
        if ($scope.drawMode == 1) {
            for (var i = 0; i < $scope.ObjectDepth; i++) {
                for (var j = 0; j < $scope.ObjectWidth; j++) {
                    $scope.selectedPosition.push({
                        parent: parseInt($parentIndex + i),
                        index: parseInt($index + j)
                    });
                }
            }

        } else if ($scope.drawMode == 0) {
            for (var i = 0; i < $scope.selectedPosition.length; i++) {
                if ($scope.selectedPosition[i].index == $index && $scope.selectedPosition[i].parent == $parentIndex) {
                    $scope.selectedPosition.splice(i, 1);
                    return;
                }
            }

            $scope.selectedPosition.push({
                parent: $parentIndex,
                index: $index
            });
        }
        else {
            for (var i = 0; i < $scope.selectedPosition.length; i++) {
                if ($scope.selectedPosition[i].index == $index && $scope.selectedPosition[i].parent == $parentIndex) {
                    $scope.selectedPosition.splice(i, 1);
                    return;
                }
            }
        }
    }

    $scope.dragOverPosition = function ($parentIndex, $index) {
        if ($scope.drawMode == 0) {
            for (var i = 0; i < $scope.selectedPosition.length; i++) {
                if ($scope.selectedPosition[i].index == $index && $scope.selectedPosition[i].parent == $parentIndex) {
                    return;
                }
            }

            $scope.selectedPosition.push({
                parent: $parentIndex,
                index: $index
            });
        } else if ($scope.drawMode == 2) {
            for (var i = 0; i < $scope.selectedPosition.length; i++) {
                if ($scope.selectedPosition[i].index == $index && $scope.selectedPosition[i].parent == $parentIndex) {
                    $scope.selectedPosition.splice(i, 1);
                    return;
                }
            }
        }
    }

    $scope.CheckActivePosition = function ($parentIndex, $index) {
        for (var i = 0; i < $scope.selectedPosition.length; i++) {
            if ($scope.selectedPosition[i].index == $index && $scope.selectedPosition[i].parent == $parentIndex) {
                return true;
            }
        }
        return false;
    }

    $scope.handleDrop = function (item, bin) {
        $scope.dragOverPosition(bin.split(',')[0], bin.split(',')[1]);
    }
})