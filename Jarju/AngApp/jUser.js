app.controller﻿("UserProfileController", function ($scope, $http, BaseService, EVENT_PATH, SYSTEM_PATH, Upload, $window, $timeout) {

    Opening();

    function Opening() {
        $scope.formData = {};
        $scope.formData.User = {};
        $scope.formData.User.USER_ID = 0;
        $scope.fileUpload = null;
        $scope.Password = "";
        BaseService.CallAction(SYSTEM_PATH, "GetUser", "0")
            .then(function (result) {
                $scope.formData.User = result[0];
            }, function (error) {
                BaseService.Message.alert('ไม่สามารถบันทึกข้อมูลได้');
                console.log('Unable to edit menu type data: ' + error.message)
            })
    }

    $scope.submituser = function () {
        if (angular.isUndefined($scope.formData.User) ||
            $scope.formData.User.NAME == null ||
            $scope.formData.User.NAME == '' ||
            $scope.formData.User.SURNAME == null ||
            $scope.formData.User.SURNAME == '' ||
            $scope.formData.User.CITIZEN_ID == null ||
            $scope.formData.User.CITIZEN_ID == '' ||
            $scope.formData.User.USERNAME == null ||
            $scope.formData.User.USERNAME == '' ||
            $scope.formData.User.ROLE_ID == null) {
            BaseService.Message.alert('กรุณากรอกข้อมูลให้ครบถ้วน');
            return;
        } else if (($scope.formData.User.USER_ID == null || $scope.formData.User.USER_ID == 0) && $scope.Password != $scope.ConfirmPassword) {
            BaseService.Message.alert('กรุณาใส่รหัสผ่านให้ตรงกัน');
        } else if ($scope.formData.User.CITIZEN_ID.length != 13) {
            BaseService.Message.alert('กรุณาใส่หมายเลขบัตรประชาชนให้ถูกต้อง');
        }
        else {
            if ($scope.Password != "")
                $scope.formData.User.PASSWORD = $scope.Password;

            let scopeData = $scope.formData.User;
            let data = $.param(scopeData);
            BaseService.CallAction(SYSTEM_PATH, "CheckUser", data)
                .then(function (result) {
                    if (result.length > 0)
                        BaseService.Message.alert('มีผู้ใช้งานนี้อยู่แล้ว');
                    else {
                        let scopeData = $scope.formData.User;
                        let data = $.param(scopeData)

                        BaseService.CallAction(SYSTEM_PATH, "SubmitUser", data)
                            .then(function (result) {
                                $scope.formData.User = result;
                                BaseService.Message.alert('บันทึกข้อมูลสำเร็จ');
                            }, function (error) {
                                BaseService.Message.alert('ไม่สามารถบันทึกข้อมูลได้');
                                console.log('Unable to edit event data: ' + error.message)
                            })
                    }

                }, function (error) {
                    BaseService.Message.alert('ไม่สามารถบันทึกข้อมูลได้');
                    console.log('Unable to edit event data: ' + error.message)
                })
        }
    }
})
