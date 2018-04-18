app.controller﻿("MenuTypeController", function ($scope, $http, BaseService, MENU_PATH, $timeout) {

    Opening();

    function Opening() {
        $scope.ListHeader = {};
        $scope.formData = {};
        GetHeader();
        GetData();
    }

    function GetHeader() {
        BaseService.GetHeaderGridView("MenuTypeList")
            .then(function (result) {
                $scope.ListHeader = result;
                console.log(result);
            }, function (error) {
                console.log('Unable to load menu type header data: ' + error.message)
            })
    }

    function GetData() {
        BaseService.GetDataTable(MENU_PATH, "GetMenuTypeList")
            .then(function (result) {
                console.log(result)
                $scope.ListDetail = result;
            }, function (error) {
                console.log('Unable to load menu type data: ' + error.message)
            })
    }

    $scope.OrderColumn = function (pColName) {
        $scope.sortType = pColName;
        $scope.sortReverse = !$scope.sortReverse;
    };

    $scope.ShowItem_Click = function (ITEM_TYPE_ID) {
        document.getElementById('DetailModal').style.display = 'block';
        var sendData = [{ "ITEM_TYPE_ID": ITEM_TYPE_ID}];
        var data = $.param(sendData[0]);

        BaseService.CallAction(MENU_PATH, "GetMenuTypeList", data)
            .then(function (result) {
                $scope.formData.MenuType = result[0]
            }, function (error) {
                console.log('Unable to load menu type data: ' + error.message)
            })
    }

    $scope.CloseItem_Click = function (ID) {
        document.getElementById('DetailModal').style.display = 'none';
    }

    $scope.Edit_Submit = function () {

        if ($scope.formData.MenuType == null) {
            BaseService.Message.alert('กรุณากรอกข้อมูลให้ครบถ้วน');
            return;
        }

        if ($scope.formData.MenuType.NAME == '' || $scope.formData.MenuType.NAME == null) {
            BaseService.Message.alert('กรุณากรอกข้อมูลให้ครบถ้วน');
            return;
        }

        let scopeData = $scope.formData.MenuType;
        let data = $.param(scopeData)

        BaseService.CallAction(MENU_PATH, "EditMenuTypeConf", data)
            .then(function (result) {
                GetData();
                BaseService.Message.info('บันทึกข้อมูลเรียบร้อย');
                document.getElementById('DetailModal').style.display = 'none';
            }, function (error) {
                BaseService.Message.alert('ไม่สามารถบันทึกข้อมูลได้');
                console.log('Unable to edit menu type data: ' + error.message)
            })

    }
})

app.controller﻿("MenuStyleController", function ($scope, $http, BaseService, MENU_PATH, $timeout) {

    Opening();

    function Opening() {
        $scope.ListHeader = {};
        $scope.formData = {};
        GetHeader();
        GetData();

        BaseService.GetDataTable(MENU_PATH, "GetMenuTypeList")
            .then(function (result) {
                $scope.MenuType = result;
            }, function (error) {
                console.log('Unable to load menu type data: ' + error.message)
            })
    }

    function GetHeader() {
        BaseService.GetHeaderGridView("MenuStyleList")
            .then(function (result) {
                $scope.ListHeader = result;
                console.log(result);
            }, function (error) {
                console.log('Unable to load menu type header data: ' + error.message)
            })
    }

    function GetData() {
        BaseService.GetDataTable(MENU_PATH, "GetMenuStyleList")
            .then(function (result) {
                console.log(result)
                $scope.ListDetail = result;
            }, function (error) {
                console.log('Unable to load menu type data: ' + error.message)
            })
    }

    $scope.OrderColumn = function (pColName) {
        $scope.sortType = pColName;
        $scope.sortReverse = !$scope.sortReverse;
    };

    $scope.ShowItem_Click = function (ITEM_STYLE_ID) {
        document.getElementById('DetailModal').style.display = 'block';
        var sendData = [{ "ITEM_STYLE_ID": ITEM_STYLE_ID }];
        var data = $.param(sendData[0]);

        BaseService.CallAction(MENU_PATH, "GetMenuStyleList", data)
            .then(function (result) {
                $scope.formData.MenuStyle = result[0];
            }, function (error) {
                console.log('Unable to load menu type data: ' + error.message)
            })
    }

    $scope.CloseItem_Click = function (ID) {
        document.getElementById('DetailModal').style.display = 'none';
    }

    $scope.Edit_Submit = function () {

        if ($scope.formData.MenuStyle == null) {
            BaseService.Message.alert('กรุณากรอกข้อมูลให้ครบถ้วน');
            return;
        }

        if ($scope.formData.MenuStyle.NAME == '' || $scope.formData.MenuStyle.NAME == null) {
            BaseService.Message.alert('กรุณากรอกข้อมูลให้ครบถ้วน');
            return;
        }

        if ($scope.formData.MenuStyle.ITEM_TYPE_ID == '' || $scope.formData.MenuStyle.ITEM_TYPE_ID == null) {
            BaseService.Message.alert('กรุณากรอกข้อมูลให้ครบถ้วน');
            return;
        }

        let scopeData = $scope.formData.MenuStyle;
        let data = $.param(scopeData)

        BaseService.CallAction(MENU_PATH, "EditMenuStyleConf", data)
            .then(function (result) {
                GetData();
                BaseService.Message.info('บันทึกข้อมูลเรียบร้อย');
                document.getElementById('DetailModal').style.display = 'none';
            }, function (error) {
                BaseService.Message.alert('ไม่สามารถบันทึกข้อมูลได้');
                console.log('Unable to edit menu type data: ' + error.message)
            })

    }
})

app.controller﻿("MenuController", function ($scope, $http, BaseService, MENU_PATH, $timeout) {

    Opening();

    function Opening() {
        $scope.ListHeader = {};
        $scope.formData = {};
        GetHeader();
        GetData();

        BaseService.GetDataTable(MENU_PATH, "GetMenuStyleList")
            .then(function (result) {
                $scope.MenuStyle = result;
            }, function (error) {
                console.log('Unable to load menu type data: ' + error.message)
            })
    }

    function GetHeader() {
        BaseService.GetHeaderGridView("MenuList")
            .then(function (result) {
                $scope.ListHeader = result;
            }, function (error) {
                console.log('Unable to load menu type header data: ' + error.message)
            })
    }

    function GetData() {
        BaseService.GetDataTable(MENU_PATH, "GetMenuList")
            .then(function (result) {
                $scope.ListDetail = result;
            }, function (error) {
                console.log('Unable to load menu type data: ' + error.message)
            })
    }

    $scope.OrderColumn = function (pColName) {
        $scope.sortType = pColName;
        $scope.sortReverse = !$scope.sortReverse;
    };

    $scope.ShowItem_Click = function (ITEM_MENU_ID) {
        document.getElementById('DetailModal').style.display = 'block';
        var sendData = [{ "ITEM_MENU_ID": ITEM_MENU_ID }];
        var data = $.param(sendData[0]);

        BaseService.CallAction(MENU_PATH, "GetMenuList", data)
            .then(function (result) {
                $scope.formData.Menu = result[0];
            }, function (error) {
                console.log('Unable to load menu type data: ' + error.message)
            })
    }

    $scope.CloseItem_Click = function (ID) {
        document.getElementById('DetailModal').style.display = 'none';
    }

    $scope.Edit_Submit = function () {

        if ($scope.formData.Menu == null) {
            BaseService.Message.alert('กรุณากรอกข้อมูลให้ครบถ้วน');
            return;
        }

        if ($scope.formData.Menu.NAME == '' || $scope.formData.Menu.NAME == null) {
            BaseService.Message.alert('กรุณากรอกข้อมูลให้ครบถ้วน');
            return;
        }

        if ($scope.formData.Menu.ITEM_STYLE_ID == '' || $scope.formData.Menu.ITEM_STYLE_ID == null) {
            BaseService.Message.alert('กรุณากรอกข้อมูลให้ครบถ้วน');
            return;
        }

        let scopeData = $scope.formData.Menu;
        let data = $.param(scopeData)

        BaseService.CallAction(MENU_PATH, "EditMenuConf", data)
            .then(function (result) {
                GetData();
                BaseService.Message.info('บันทึกข้อมูลเรียบร้อย');
                document.getElementById('DetailModal').style.display = 'none';
            }, function (error) {
                BaseService.Message.alert('ไม่สามารถบันทึกข้อมูลได้');
                console.log('Unable to edit menu type data: ' + error.message)
            })

    }
})
