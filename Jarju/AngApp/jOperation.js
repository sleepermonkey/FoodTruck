app.controller﻿("CustomerController", function ($scope, $http, BaseService, OPERATION_PATH, $timeout) {

    Opening();

    function Opening() {
        $scope.ListHeader = {};
        $scope.formData = {};
        $scope.DeletedTel = [];
        $scope.DeletedEmail = [];
        GetHeader();
        GetData();
    }

    function GetHeader() {
        BaseService.GetHeaderGridView("CustomerList")
            .then(function (result) {
                $scope.ListHeader = result
                console.log(result)
            }, function (error) {
                console.log('Unable to load food menu header data: ' + error.message)
            })
    }

    function GetData() {
        BaseService.GetDataTable(OPERATION_PATH, "GetCustomerList")
            .then(function (result) {
                console.log(result);
                $scope.ListDetail = result;
            }, function (error) {
                console.log('Unable to load customer data: ' + error.message)
            })
    }

    function GetTel(ID) {
        var sendData = [{ "ID": ID }];
        var data = $.param(sendData[0]);
        BaseService.CallAction(OPERATION_PATH, "GetCustomerTel", data)
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
        BaseService.CallAction(OPERATION_PATH, "GetCustomerEmail", data)
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
        BaseService.CallAction(OPERATION_PATH, "CheckCustomerData", data)
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

        BaseService.CallAction(OPERATION_PATH, "UpdateCustomerData", data)
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
        BaseService.CallAction(OPERATION_PATH, "AddTel", data)
            .then(function (result) {
            }, function (error) {
                console.log('Unable to load customer data: ' + error.message)
            })
    }

    function UpdateTel(ID,Tel) {
        var sendData = [{"ID": ID, "Tel": Tel }];
        var data = $.param(sendData[0]);
        BaseService.CallAction(OPERATION_PATH, "UpdateTel", data)
            .then(function (result) {
            }, function (error) {
                console.log('Unable to load customer data: ' + error.message)
            })
    }

    function DeleteTel(ID) {
        var sendData = [{ "ID": ID }];
        var data = $.param(sendData[0]);
        BaseService.CallAction(OPERATION_PATH, "DeleteTel", data)
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
        BaseService.CallAction(OPERATION_PATH, "AddEmail", data)
            .then(function (result) {
            }, function (error) {
                console.log('Unable to load customer data: ' + error.message)
            })
    }

    function UpdateEmail(ID, Tel) {
        var sendData = [{ "ID": ID, "Email": Tel }];
        var data = $.param(sendData[0]);
        BaseService.CallAction(OPERATION_PATH, "UpdateEmail", data)
            .then(function (result) {
            }, function (error) {
                console.log('Unable to load customer data: ' + error.message)
            })
    }

    function DeleteEmail(ID) {
        var sendData = [{ "ID": ID }];
        var data = $.param(sendData[0]);
        BaseService.CallAction(OPERATION_PATH, "DeleteEmail", data)
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

        BaseService.CallAction(OPERATION_PATH, "GetCustomerList", data)
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

app.controller﻿("CalendarController", function ($scope, $window, $http, BaseService, OPERATION_PATH, $timeout, moment, calendarConfig) {
    
    $scope.cellIsOpen = true;
    $scope.calendarView = 'month';
    $scope.viewDate = new Date();
    $scope.viewDate.setDate($scope.viewDate.getDate() + 1);
    $scope.formData = {};
    $scope.formData.EVENT_TYPE = 0;
    $scope.popupEventDate = [];

    var actions = [{
        label: '<i class=\'glyphicon glyphicon-pencil\'></i>',
        onClick: function (args) {
            BaseService.Message.info('Edit' + args.calendarEvent);
        }
    }/*, {
        label: '<i class=\'glyphicon glyphicon-remove\'></i>',
        onClick: function (args) {
            BaseService.Message.info('Delete' + args.calendarEvent);
        }
        }*/];

    $scope.events = [
        {
            title: 'Buffet',
            color: calendarConfig.colorTypes.buffet,
            startsAt: moment().startOf('day').add(7, 'hours').toDate(),
            endsAt: moment().startOf('day').add(19, 'hours').toDate(),
            draggable: false,
            resizable: false,
            actions: actions,
            type: 'buffet'
        }, {
            title: 'FoodBox',
            color: calendarConfig.colorTypes.foodbox,
            startsAt: moment().subtract(1, 'day').toDate(),
            endsAt: moment().add(0, 'days').toDate(),
            draggable: false,
            resizable: false,
            actions: actions,
            type: 'foodbox'
        }, {
            title: 'FoodBox',
            color: calendarConfig.colorTypes.foodbox,
            startsAt: moment().startOf('day').add(7, 'hours').toDate(),
            endsAt: moment().startOf('day').add(19, 'hours').toDate(),
            draggable: false,
            resizable: false,
            actions: actions,
            type: 'foodbox'
        }, {
            title: 'Coffee Break',
            color: calendarConfig.colorTypes.coffeebreak,
            startsAt: moment().startOf('day').add(7, 'hours').toDate(),
            endsAt: moment().startOf('day').add(19, 'hours').toDate(),
            draggable: false,
            resizable: false,
            actions: actions,
            type: 'coffeebreak'
        }, {
            title: 'Other',
            color: calendarConfig.colorTypes.other,
            startsAt: moment().startOf('day').add(7, 'hours').toDate(),
            endsAt: moment().startOf('day').add(19, 'hours').toDate(),
            draggable: false,
            resizable: false,
            actions: actions,
            type: 'xxx'
        }
    ];
    
    $scope.addEvent = function () {
        $scope.formData.EVENT_DATE = moment($scope.viewDate, "DD-MM-YYYY").add('days', 1);
        document.getElementById('DetailModal').style.display = 'block';
        /*$scope.events.push({
            title: 'New event',
            startsAt: $scope.viewDate,
            endsAt: $scope.viewDate,
            color: calendarConfig.colorTypes.important,
            draggable: false,
            resizable: false 
        });*/
    };

    $scope.eventClicked = function (event) {
        BaseService.Message.info('Clicked' + event);
    };

    $scope.eventEdited = function (event) {
        BaseService.Message.info('Edited' + event);
    };

    $scope.eventDeleted = function (event) {
        BaseService.Message.info('Deleted' + event);
    };

    $scope.eventTimesChanged = function (event) {
        BaseService.Message.info('Drop' + event);
    };

    $scope.toggle = function ($event, field, event) {
        $event.preventDefault();
        $event.stopPropagation();
        event[field] = !event[field];
    };

    $scope.timespanClicked = function (date, cell) {
        if ($scope.calendarView === 'month') {
            if (($scope.cellIsOpen && moment(date).startOf('day').isSame(moment($scope.viewDate).startOf('day'))) || cell.events.length === 0 || !cell.inMonth) {
                $scope.cellIsOpen = false;
            } else {
                $scope.cellIsOpen = true;
                $scope.viewDate = date;
            }
        } else if ($scope.calendarView === 'year') {
            if (($scope.cellIsOpen && moment(date).startOf('month').isSame(moment($scope.viewDate).startOf('month'))) || cell.events.length === 0) {
                $scope.cellIsOpen = false;
            } else {
                $scope.cellIsOpen = true;
                $scope.viewDate = date;
            }
        }
    }; 

    $scope.openEventDate = function () {
        $scope.popupEventDate.opened = true;
    }

    $scope.popupEventDate = {
        opened: false
    }
})

app.controller﻿("TestGridController", function ($scope, $http, BaseService, OPERATION_PATH, $timeout) {

    Opening();

    function Opening() {

        
    }

    $scope.selectedPosition = []
    $scope.selectPosition = function ($parentIndex, $index) {

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

    $scope.dragOverPosition = function ($parentIndex, $index) {

        for (var i = 0; i < $scope.selectedPosition.length; i++) {
            if ($scope.selectedPosition[i].index == $index && $scope.selectedPosition[i].parent == $parentIndex) {
                return;
            }
        }

        $scope.selectedPosition.push({
            parent: $parentIndex,
            index: $index
        });
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

    function GetHeader() {
        BaseService.GetHeaderGridView("CustomerList")
            .then(function (result) {
                $scope.ListHeader = result
                console.log(result)
            }, function (error) {
                console.log('Unable to load food menu header data: ' + error.message)
            })
    }

    function GetData() {
        BaseService.GetDataTable(OPERATION_PATH, "GetCustomerList")
            .then(function (result) {
                console.log(result);
                $scope.ListDetail = result;
            }, function (error) {
                console.log('Unable to load customer data: ' + error.message)
            })
    }

    function GetTel(ID) {
        var sendData = [{ "ID": ID }];
        var data = $.param(sendData[0]);
        BaseService.CallAction(OPERATION_PATH, "GetCustomerTel", data)
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
        BaseService.CallAction(OPERATION_PATH, "GetCustomerEmail", data)
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
        BaseService.CallAction(OPERATION_PATH, "CheckCustomerData", data)
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

        BaseService.CallAction(OPERATION_PATH, "UpdateCustomerData", data)
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
                UpdateTel($scope.ListTel[i].ID, $scope.ListTel[i].TEL);
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
        BaseService.CallAction(OPERATION_PATH, "AddTel", data)
            .then(function (result) {
            }, function (error) {
                console.log('Unable to load customer data: ' + error.message)
            })
    }

    function UpdateTel(ID, Tel) {
        var sendData = [{ "ID": ID, "Tel": Tel }];
        var data = $.param(sendData[0]);
        BaseService.CallAction(OPERATION_PATH, "UpdateTel", data)
            .then(function (result) {
            }, function (error) {
                console.log('Unable to load customer data: ' + error.message)
            })
    }

    function DeleteTel(ID) {
        var sendData = [{ "ID": ID }];
        var data = $.param(sendData[0]);
        BaseService.CallAction(OPERATION_PATH, "DeleteTel", data)
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
        BaseService.CallAction(OPERATION_PATH, "AddEmail", data)
            .then(function (result) {
            }, function (error) {
                console.log('Unable to load customer data: ' + error.message)
            })
    }

    function UpdateEmail(ID, Tel) {
        var sendData = [{ "ID": ID, "Email": Tel }];
        var data = $.param(sendData[0]);
        BaseService.CallAction(OPERATION_PATH, "UpdateEmail", data)
            .then(function (result) {
            }, function (error) {
                console.log('Unable to load customer data: ' + error.message)
            })
    }

    function DeleteEmail(ID) {
        var sendData = [{ "ID": ID }];
        var data = $.param(sendData[0]);
        BaseService.CallAction(OPERATION_PATH, "DeleteEmail", data)
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

        BaseService.CallAction(OPERATION_PATH, "GetCustomerList", data)
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