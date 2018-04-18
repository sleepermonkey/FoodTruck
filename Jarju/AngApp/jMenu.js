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
                console.log(result)
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


app.controller﻿("MenuCategoryController", function ($scope, $http, BaseService, CONFIG_PATH, $timeout) {

    Opening();

    function Opening() {
        $scope.ListHeader = {};
        $scope.formData = {};
        GetHeader();
        GetData();
    }

    function GetHeader() {
        BaseService.GetHeaderGridView("MenuCategoryList")
            .then(function (result) {
                $scope.ListHeader = result
                console.log(result)
            }, function (error) {
                console.log('Unable to load menu category header data: ' + error.message)
            })
    }

    function GetData() {
        BaseService.GetDataTable(CONFIG_PATH, "GetMenuCategoryList")
            .then(function (result) {
                console.log(result)
                $scope.ListDetail = result
            }, function (error) {
                console.log('Unable to load menu category data: ' + error.message)
            })
    }

    $scope.OrderColumn = function (pColName) {
        $scope.sortType = pColName;
        $scope.sortReverse = !$scope.sortReverse;
    };

    $scope.ShowItem_Click = function (ID) {
        document.getElementById('DetailModal').style.display = 'block';
        var sendData = [{ "ID": ID }];
        var data = $.param(sendData[0]);

        BaseService.CallAction(CONFIG_PATH, "GetMenuCategoryList", data)
            .then(function (result) {
                $scope.formData.MenuCate = result[0]
            }, function (error) {
                console.log('Unable to load menu category data: ' + error.message)
            })
    }

    $scope.CloseItem_Click = function (ID) {
        document.getElementById('DetailModal').style.display = 'none';
    }

    $scope.Edit_Submit = function () {

        if ($scope.formData.MenuCate == null) {
            BaseService.Message.alert('กรุณากรอกข้อมูลให้ครบถ้วน');
            return;
        }

        if ($scope.formData.MenuCate.NAME == '' || $scope.formData.MenuCate.NAME == null) {
            BaseService.Message.alert('กรุณากรอกข้อมูลให้ครบถ้วน');
            return;
        }

        let scopeData = $scope.formData.MenuCate;
        let data = $.param(scopeData)

        BaseService.CallAction(CONFIG_PATH, "EditMenuCategoryConf", data)
            .then(function (result) {
                GetData();
                BaseService.Message.info('บันทึกข้อมูลเรียบร้อย');
                document.getElementById('DetailModal').style.display = 'none';
            }, function (error) {
                BaseService.Message.alert('ไม่สามารถบันทึกข้อมูลได้');
                console.log('Unable to edit menu category data: ' + error.message)
            })

    }
})

app.controller﻿("FoodMenuController", function ($scope, $http, BaseService, CONFIG_PATH, $timeout) {

    Opening();

    function Opening() {
        $scope.ListHeader = {};
        $scope.formData = {};
        GetMenuType();
        GetMenuCategory();
        GetHeader();
        GetData();
    }

    function GetMenuType() {
        BaseService.GetDataTable(CONFIG_PATH, "GetMenuTypeList")
            .then(function (result) {
                console.log(result);
                $scope.MenuTypeList = result;
            }, function (error) {
                console.log('Unable to load menu type data: ' + error.message)
            })
    }

    function GetMenuCategory() {
        BaseService.GetDataTable(CONFIG_PATH, "GetMenuCategoryList")
            .then(function (result) {
                console.log(result);
                $scope.MenuCategoryList = result;
            }, function (error) {
                console.log('Unable to load menu type data: ' + error.message)
            })
    }

    function GetHeader() {
        BaseService.GetHeaderGridView("FoodMenuList")
            .then(function (result) {
                $scope.ListHeader = result
                console.log(result)
            }, function (error) {
                console.log('Unable to load food menu header data: ' + error.message)
            })
    }

    function GetData() {
        BaseService.GetDataTable(CONFIG_PATH, "GetFoodMenuList")
            .then(function (result) {
                console.log(result);
                $scope.ListDetail = result;
            }, function (error) {
                console.log('Unable to load food menu data: ' + error.message)
            })
    }

    $scope.OrderColumn = function (pColName) {
        $scope.sortType = pColName;
        $scope.sortReverse = !$scope.sortReverse;
    };

    $scope.ShowItem_Click = function (ID) {
        document.getElementById('DetailModal').style.display = 'block';
        var sendData = [{ "MENU_ID": ID }];
        var data = $.param(sendData[0]);

        BaseService.CallAction(CONFIG_PATH, "GetFoodMenuList", data)
            .then(function (result) {
                $scope.formData.FoodMenu = result[0];
            }, function (error) {
                console.log('Unable to load food menu data: ' + error.message)
            });
        
    }

    $scope.CloseItem_Click = function (ID) {
        document.getElementById('DetailModal').style.display = 'none';
    }

    $scope.Edit_Submit = function () {

        if ($scope.formData.FoodMenu == null) {
            BaseService.Message.alert('กรุณากรอกข้อมูลให้ครบถ้วน');
            return;
        }

        if ($scope.formData.FoodMenu.NAME == '' || $scope.formData.FoodMenu.NAME == null) {
            BaseService.Message.alert('กรุณากรอกข้อมูลให้ครบถ้วน');
            return;
        }

        if ($scope.formData.FoodMenu.MENU_TYPE_ID == '' || $scope.formData.FoodMenu.MENU_TYPE_ID == null) {
            BaseService.Message.alert('กรุณากรอกข้อมูลให้ครบถ้วน');
            return;
        }

        if ($scope.formData.FoodMenu.MENU_CATE_ID == '' || $scope.formData.FoodMenu.MENU_CATE_ID == null) {
            BaseService.Message.alert('กรุณากรอกข้อมูลให้ครบถ้วน');
            return;
        }

        let scopeData = $scope.formData.FoodMenu;
        let data = $.param(scopeData)

        BaseService.CallAction(CONFIG_PATH, "EditFoodMenuConf", data)
            .then(function (result) {
                BaseService.Message.info('บันทึกข้อมูลเรียบร้อย');
                GetData();
                document.getElementById('DetailModal').style.display = 'none';
            }, function (error) {
                BaseService.Message.info('ไม่สามารถบันทึกข้อมูลได้');
                console.log('Unable to edit dealer data: ' + error.message)
            })

    }

})

app.controller﻿("BuffetPackageController", function ($scope, $http, BaseService, CONFIG_PATH, $timeout) {

    Opening();

    function Opening() {
        $scope.ListHeader = {};
        $scope.formData = {};
        $scope.formData.CATE = [];
        GetHeader();
        GetData();
    }

    function GetHeader() {
        BaseService.GetHeaderGridView("BuffetPackageList")
            .then(function (result) {
                $scope.ListHeader = result
                console.log(result)
            }, function (error) {
                console.log('Unable to load buffet package header data: ' + error.message)
            })
    }

    function GetData() {
        BaseService.GetDataTable(CONFIG_PATH, "GetBuffetPackageList")
            .then(function (result) {
                console.log(result);
                $scope.ListDetail = result;
            }, function (error) {
                console.log('Unable to load buffet package data: ' + error.message)
            })
    }

    $scope.OrderColumn = function (pColName) {
        $scope.sortType = pColName;
        $scope.sortReverse = !$scope.sortReverse;
    };

    $scope.ShowItem_Click = function (ID) {
        document.getElementById('DetailModal').style.display = 'block';
        var sendData = [{ "PACKAGE_ID": ID }];
        var data = $.param(sendData[0]);

        BaseService.CallAction(CONFIG_PATH, "GetBuffetPackageList", data)
            .then(function (result) {
                $scope.formData.Package = result[0];
            }, function (error) {
                console.log('Unable to load buffet package data: ' + error.message)
            });

        BaseService.CallAction(CONFIG_PATH, "GetBuffetPackageCateList", data)
            .then(function (result) {
                $scope.formData.CATE = result;
            }, function (error) {
                console.log('Unable to load buffet package data: ' + error.message)
            });
    }

    $scope.CloseItem_Click = function (ID) {
        document.getElementById('DetailModal').style.display = 'none';
    }

    $scope.Edit_Submit = function () {

        if ($scope.formData.Package == null) {
            BaseService.Message.alert('กรุณากรอกข้อมูลให้ครบถ้วน');
            return;
        }

        if ($scope.formData.Package.NAME == '' || $scope.formData.Package.NAME == null) {
            BaseService.Message.alert('กรุณากรอกข้อมูลให้ครบถ้วน');
            return;
        }

        if ($scope.formData.Package.MIN_AMOUNT == '' || $scope.formData.Package.MIN_AMOUNT == null) {
            BaseService.Message.alert('กรุณากรอกข้อมูลให้ครบถ้วน');
            return;
        }

        if ($scope.formData.Package.PRICE == '' || $scope.formData.Package.PRICE == null) {
            BaseService.Message.alert('กรุณากรอกข้อมูลให้ครบถ้วน');
            return;
        }

        let scopeData = $scope.formData.Package;
        let data = $.param(scopeData)

        BaseService.CallAction(CONFIG_PATH, "EditBuffetPackageConf", data)
            .then(function (result) {

                let scopeData = $scope.formData.CATE;
                var finishedLoop = 0;

                for (i = 0; i < scopeData.length; i++) {

                    if ($scope.formData.Package.PACKAGE_ID == null || $scope.formData.Package.PACKAGE_ID == 0)
                        scopeData[i].PACKAGE_ID = result[0].PACKAGE_ID;
                    else
                        scopeData[i].PACKAGE_ID = $scope.formData.Package.PACKAGE_ID;

                    let data = $.param(scopeData[i])

                    BaseService.CallAction(CONFIG_PATH, "EditBuffetPackageCategoryConf", data)
                        .then(function (result) {
                            finishedLoop++;

                            if (finishedLoop == scopeData.length - 1) {
                                BaseService.Message.info('บันทึกข้อมูลเรียบร้อย');
                                document.getElementById('DetailModal').style.display = 'none';
                                GetData();
                            }
                        }, function (error) {
                            BaseService.Message.alert('ไม่สามารถบันทึกข้อมูลได้');
                            console.log('Unable to edit Rs Volume data: ' + error.message)
                        })
                }         
            }, function (error) {
                BaseService.Message.alert('ไม่สามารถบันทึกข้อมูลได้');
                console.log('Unable to edit dealer data: ' + error.message)
            })
    }

})