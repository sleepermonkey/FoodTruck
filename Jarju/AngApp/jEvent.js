app.controller﻿("EventDisplayController", function ($scope, $http, BaseService, EVENT_PATH, $timeout) {

    Opening();

    function Opening() {
        $scope.formData = {};
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

    function GetTel(ID) {
        var sendData = [{ "ID": ID }];
        var data = $.param(sendData[0]);
        BaseService.CallAction(EVENT_PATH, "GetCustomerTel", data)
            .then(function (result) {
                console.log(result);
                $scope.ListTel = result;
            }, function (error) {
                console.log('Unable to load customer data: ' + error.message)
            })
    }

    function GetEmail(ID) {
        var sendData = [{ "ID": ID }];
        var data = $.param(sendData[0]);
        BaseService.CallAction(EVENT_PATH, "GetCustomerEmail", data)
            .then(function (result) {
                console.log(result);
                $scope.ListEmail = result;
            }, function (error) {
                console.log('Unable to load customer data: ' + error.message)
            })
    }

    function CheckCustomerData() {
        var CheckString = '';
        for (var i = 0; i < $scope.ListTel.length; i++) {
            CheckString += '\'' + $scope.ListTel[i].TEL + '\',';
        }

        for (var i = 0; i < $scope.ListEmail.length; i++) {
            CheckString += '\'' + $scope.ListEmail[i].EMAIL + '\',';
        }

        CheckString = CheckString.substring(0, CheckString.length - 1);
        var sendData = [{ "ID": $scope.formData.Customer.ID, "Data": CheckString }];
        var data = $.param(sendData[0]);
        BaseService.CallAction(EVENT_PATH, "CheckCustomerData", data)
            .then(function (result) {
                if (result.length > 0) {
                    BaseService.Message.alert('Duplicated Telephone or E-mail');
                } else {
                    UpdateCustomerData();
                }
            }, function (error) {
            });
    }

    function UpdateCustomerData() {
        let scopeData = $scope.formData.Customer;
        let data = $.param(scopeData)

        BaseService.CallAction(EVENT_PATH, "UpdateCustomerData", data)
            .then(function (result) {
                if (result.length > 0) {
                    $scope.formData.Customer.ID = result[0].ID;
                }
                UpdateTelData();
                document.getElementById('DetailModal').style.display = 'none';
            }, function (error) {
                BaseService.Message.alert('ไม่สามารถบันทึกข้อมูลได้');
                console.log('Unable to edit dealer data: ' + error.message)
            });
    }

    function UpdateTelData() {
        for (var i = 0; i < $scope.ListTel.length; i++) {
            if ($scope.ListTel[i].ID == 0) {
                AddTel($scope.ListTel[i].TEL);
            } else {
                UpdateTel($scope.ListTel[i].ID,$scope.ListTel[i].TEL);
            }
        }

        for (var i = 0; i < $scope.DeletedTel.length; i++) {
            DeleteTel($scope.DeletedTel[i].ID);
        }
        UpdateEmailData();
    }

    function AddTel(Tel) {
        var sendData = [{ "ID": $scope.formData.Customer.ID, "Tel": Tel }];
        var data = $.param(sendData[0]);
        BaseService.CallAction(EVENT_PATH, "AddTel", data)
            .then(function (result) {
            }, function (error) {
                console.log('Unable to load customer data: ' + error.message)
            })
    }

    function UpdateTel(ID,Tel) {
        var sendData = [{"ID": ID, "Tel": Tel }];
        var data = $.param(sendData[0]);
        BaseService.CallAction(EVENT_PATH, "UpdateTel", data)
            .then(function (result) {
            }, function (error) {
                console.log('Unable to load customer data: ' + error.message)
            })
    }

    function DeleteTel(ID) {
        var sendData = [{ "ID": ID }];
        var data = $.param(sendData[0]);
        BaseService.CallAction(EVENT_PATH, "DeleteTel", data)
            .then(function (result) {
            }, function (error) {
                console.log('Unable to load customer data: ' + error.message)
            })
    }

    function UpdateEmailData() {
        for (var i = 0; i < $scope.ListEmail.length; i++) {
            if ($scope.ListEmail[i].ID == 0) {
                AddEmail($scope.ListEmail[i].EMAIL);
            } else {
                UpdateEmail($scope.ListEmail[i].ID, $scope.ListEmail[i].EMAIL);
            }
        }

        for (var i = 0; i < $scope.DeletedEmail.length; i++) {
            DeleteEmail($scope.DeletedEmail[i].ID);
        }

        BaseService.Message.info('บันทึกข้อมูลสำเร็จ')
            .then(function (result) {
                GetData();
            });
    }

    function AddEmail(Email) {
        var sendData = [{ "ID": $scope.formData.Customer.ID, "Email": Email }];
        var data = $.param(sendData[0]);
        BaseService.CallAction(EVENT_PATH, "AddEmail", data)
            .then(function (result) {
            }, function (error) {
                console.log('Unable to load customer data: ' + error.message)
            })
    }

    function UpdateEmail(ID, Tel) {
        var sendData = [{ "ID": ID, "Email": Tel }];
        var data = $.param(sendData[0]);
        BaseService.CallAction(EVENT_PATH, "UpdateEmail", data)
            .then(function (result) {
            }, function (error) {
                console.log('Unable to load customer data: ' + error.message)
            })
    }

    function DeleteEmail(ID) {
        var sendData = [{ "ID": ID }];
        var data = $.param(sendData[0]);
        BaseService.CallAction(EVENT_PATH, "DeleteEmail", data)
            .then(function (result) {
            }, function (error) {
                console.log('Unable to load customer data: ' + error.message)
            })
    }

    $scope.OrderColumn = function (pColName) {
        $scope.sortType = pColName;
        $scope.sortReverse = !$scope.sortReverse;
    };

    $scope.CheckPagination = function () {
        if (($scope.FILTER.ID != null && $scope.FILTER.ID != '') || 
            ($scope.FILTER.NAME != null && $scope.FILTER.NAME != '') ||
            ($scope.FILTER.PLACE != null && $scope.FILTER.PLACE != '') ||
            ($scope.FILTER.TEL != null && $scope.FILTER.TEL != '') ||
            ($scope.FILTER.EMAIL != null && $scope.FILTER.EMAIL != '')) {
            document.getElementById('PaginationDiv').style.visibility = "hidden";
        } else {
            document.getElementById('PaginationDiv').style.visibility = "visible";
        }
    };

    $scope.ShowItem_Click = function (ID) {
        document.getElementById('DetailModal').style.display = 'block';
        var sendData = [{ "ID": ID }];
        var data = $.param(sendData[0]);

        BaseService.CallAction(EVENT_PATH, "GetCustomerList", data)
            .then(function (result) {
                $scope.formData.Customer = result[0];
            }, function (error) {
                console.log('Unable to load customer data: ' + error.message)
            });

        GetTel(ID);
        GetEmail(ID);
        $scope.DeletedTel = [];
        $scope.DeletedEmail = [];
    }

    $scope.CloseItem_Click = function (ID) {
        $scope.ADDEMAIL = '';
        $scope.ADDTEL = '';
        document.getElementById('DetailModal').style.display = 'none';
    }

    $scope.AddTel_Click = function () {
        if ($scope.ADDTEL == null || $scope.ADDTEL == '') {
            BaseService.Message.alert('กรุณากรอกข้อมูลให้ครบถ้วน');
            return;
        }
        $scope.ListTel.push({ "ID": 0, "TEL": $scope.ADDTEL });
        $scope.ADDTEL = '';
    }

    $scope.AddEmail_Click = function () {
        if ($scope.ADDEMAIL == null || $scope.ADDEMAIL == '') {
            BaseService.Message.alert('กรุณากรอกข้อมูลให้ครบถ้วน');
            return;
        }
        $scope.ListEmail.push({ "ID": 0, "EMAIL": $scope.ADDEMAIL });
        $scope.ADDEMAIL = '';
    }

    $scope.DeleteTel_Click = function (item) {
        BaseService.Message.confirm('Want to delete ' + item.TEL + '?')
            .then(function () {
                var index = $scope.ListTel.indexOf(item);
                $scope.ListTel.splice(index, 1); 
                $scope.DeletedTel.push({ "ID": item.ID, "EMAIL": item.TEL });
            });
    }

    $scope.DeleteEmail_Click = function (item) {
        BaseService.Message.confirm('Want to delete ' + item.EMAIL + '?')
            .then(function () {
                var index = $scope.ListEmail.indexOf(item);
                $scope.ListEmail.splice(index, 1);  
                $scope.DeletedEmail.push({ "ID": item.ID, "EMAIL": item.TEL });
            });
    }

    $scope.Edit_Submit = function () {
        if (($scope.ADDTEL != '' && $scope.ADDTEL != null) ||
            ($scope.ADDEMAIL != '' && $scope.ADDEMAIL != null)) {
            BaseService.Message.confirm('Some Telephone or E-mail have not been add. Want to continue?')
                .then(function () {
                    $scope.ADDTEL = '';
                    $scope.ADDEMAIL = '';
                    CheckCustomerData();
                });
        } else {
            $scope.ADDTEL = '';
            $scope.ADDEMAIL = '';
            CheckCustomerData();
        }
    }

    String.prototype.trunc = String.prototype.trunc ||
        function (n) {
            return this.split(',')[0];
        };
})