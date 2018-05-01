app.factory('BaseService', function ($http, $q, $httpParamSerializerJQLike, SYSTEM_PATH , $rootScope, $uibModal) {
    return {

        GetHeaderGridView: function (cs) {
            return $q(function (resolve, reject) {
                $http.get(window.location.origin + SYSTEM_PATH + '/GetHeaderGridView/' + cs)
                    .then(function (res) {
                        resolve(res.data);
                        //console.log(window.location.origin + SYSTEM_PATH + '/GetHeaderGridView/' + cs);
                    }, function (error) {
                        alert('พบข้อผิดพลาดในการติดต่อเชิร์ฟเวอร์ :' + error.statusText);
                        reject(error);
                    });
            });
        },

        GetReportList: function (cs) {
            return $q(function (resolve, reject) {
                $http.get(window.location.origin + SYSTEM_PATH + '/GetReportList/' + cs)
                    .then(function (res) {
                        resolve(res.data);
                        //console.log(window.location.origin + SYSTEM_PATH + '/GetReportList/' + cs);
                    }, function (error) {
                        alert('พบข้อผิดพลาดในการติดต่อเชิร์ฟเวอร์ :' + error.statusText);
                        reject(error);
                    });
            });
        },

        GetDataTable: function (servicePath, action) {
            return $q(function (resolve, reject) {
                $http.get(window.location.origin + servicePath + '/' + action + '/')
                    .then(function (res) {
                        resolve(res.data);
                        //console.log(window.location.origin + servicePath + '/' + action + '/');
                    }, function (error) {
                        alert('พบข้อผิดพลาดในการติดต่อเชิร์ฟเวอร์ :' + error.statusText);
                        reject(error);
                    });
            });
        },

        GetDataTableByParam: function (servicePath, action, param) {
            return $q(function (resolve, reject) {
                $http.get(window.location.origin + servicePath + '/' + action + '/' + param)
                    .then(function (res) {
                        resolve(res.data);
                        //console.log(window.location.origin + servicePath + '/' + action + '/' + param);
                    }, function (error) {
                        alert('พบข้อผิดพลาดในการติดต่อเชิร์ฟเวอร์ :' + error.statusText);
                        reject(error);
                    });
            });
        },

        //------- New scan -------
        CallAction: function (servicePath, action, data) {
            //alert(data);
            return $q(function (resolve, reject) {
                var config = {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
                    }
                }
                $http.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded";
                $http.post(window.location.origin + servicePath + '/' + action, data, config)
                    .then(function (res) {
                        resolve(res.data);
                    }, function (error) {
                        alert('พบข้อผิดพลาดในการติดต่อเชิร์ฟเวอร์ :' + error.statusText);
                        reject(error);
                    });
            });
        },

        //------- New scan -------
        PostAction: function (servicePath, action, data, finish) {
            //alert(data);
            return $q(function (resolve, reject) {
                var config = {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
                    }
                }
                $http.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded";
                $http.post(window.location.origin + servicePath + '/' + action, data, config)
                    .then(function (res) {
                        (typeof finish == "function") ? finish(res) : null;
                    }, function (error) {
                        console.log(error);
                    });
            });
        },

        Message: {
            info: function (customText) {
                var tempModalDefaults = {
                    backdrop: true,
                    keyboard: true,
                    modalFade: true,
                    templateUrl: 'info-modal'
                };
                var tempModalOptions = {
                    bodyText: customText
                };

                if (!tempModalDefaults.controller) {
                    tempModalDefaults.controller = function ($scope, $uibModalInstance) {
                        $scope.modalOptions = tempModalOptions;
                        $scope.modalOptions.ok = function (result) {
                            $uibModalInstance.close(result);
                        };
                        $scope.modalOptions.close = function (result) {
                            $uibModalInstance.dismiss('cancel');
                        };
                    };
                }

                return $uibModal.open(tempModalDefaults).result;
            },
            warning: function (customText) {
                var tempModalDefaults = {
                    backdrop: true,
                    keyboard: true,
                    modalFade: true,
                    templateUrl: 'warning-modal'
                };
                var tempModalOptions = {
                    bodyText: customText
                };

                if (!tempModalDefaults.controller) {
                    tempModalDefaults.controller = function ($scope, $uibModalInstance) {
                        $scope.modalOptions = tempModalOptions;
                        $scope.modalOptions.ok = function (result) {
                            $uibModalInstance.close(result);
                        };
                        $scope.modalOptions.close = function (result) {
                            $uibModalInstance.dismiss('cancel');
                        };
                    };
                }

                return $uibModal.open(tempModalDefaults).result;
            },
            alert: function (customText) {
                var tempModalDefaults = {
                    backdrop: true,
                    keyboard: true,
                    modalFade: true,
                    templateUrl: 'alert-modal'
                };
                var tempModalOptions = {
                    bodyText: customText
                };

                if (!tempModalDefaults.controller) {
                    tempModalDefaults.controller = function ($scope, $uibModalInstance) {
                        $scope.modalOptions = tempModalOptions;
                        $scope.modalOptions.ok = function (result) {
                            $uibModalInstance.close(result);
                        };
                        $scope.modalOptions.close = function (result) {
                            $uibModalInstance.dismiss('cancel');
                        };
                    };
                }

                return $uibModal.open(tempModalDefaults).result;
            },
            confirm: function (customText) {
                var tempModalDefaults = {
                    backdrop: true,
                    keyboard: true,
                    modalFade: true,
                    templateUrl: 'confirm-modal'
                };
                var tempModalOptions = {
                    bodyText: customText
                };

                if (!tempModalDefaults.controller) {
                    tempModalDefaults.controller = function ($scope, $uibModalInstance) {
                        $scope.modalOptions = tempModalOptions;
                        $scope.modalOptions.ok = function (result) {
                            $uibModalInstance.close(result);
                        };
                        $scope.modalOptions.close = function (result) {
                            $uibModalInstance.dismiss();
                        };
                    };
                }

                return $uibModal.open(tempModalDefaults).result;
            },
            input: function (customText) {
                var tempModalDefaults = {
                    backdrop: true,
                    keyboard: true,
                    modalFade: true,
                    templateUrl: 'input-modal'
                };
                var tempModalOptions = {
                    bodyText: customText,
                    inputData: ''
                };

                if (!tempModalDefaults.controller) {
                    tempModalDefaults.controller = function ($scope, $uibModalInstance) {
                        $scope.modalOptions = tempModalOptions;
                        $scope.modalOptions.ok = function (result) {
                            $uibModalInstance.close($scope.modalOptions.inputData);
                        };
                        $scope.modalOptions.close = function (result) {
                            $uibModalInstance.dismiss();
                        };
                    };
                }

                return $uibModal.open(tempModalDefaults).result;
            }
        }

    };
});