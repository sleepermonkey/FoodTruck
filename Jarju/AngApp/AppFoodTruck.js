var app = angular.module('FoodTruck_Module', ['mwl.calendar', 'ui.bootstrap', 'ngAnimate'] );

app.constant('SYSTEM_PATH', '/SystemDS');
app.constant('EVENT_PATH', '/EventDS');
app.constant('CONFIG_PATH', '/ConfigDS');
app.constant('OPERATION_PATH', '/OperationDs');
//app.constant('REPORT_PATH', '/WSYS/mllReport.aspx?rid=');

app.config([
    '$httpProvider', function ($httpProvider) {
        // Initialize get if not there
        if (!$httpProvider.defaults.headers.get) {
            $httpProvider.defaults.headers.get = {};
        }

        // Enables Request.IsAjaxRequest() in ASP.NET MVC
        $httpProvider.defaults.headers.common["X-Requested-With"] = 'XMLHttpRequest';

        // Disable IE ajax request caching
        $httpProvider.defaults.headers.get['If-Modified-Since'] = '0';
    }
])

app.directive('loading', ['$http', function ($http) {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            scope.isLoading = function () {
                return $http.pendingRequests.length > 0;
            };

            scope.$watch(scope.isLoading, function (v) {
                if (v) {
                    element.show();
                } else {
                    element.hide();
                }
            });
        }
    };

}]);

app.directive('paginationTable', function ($compile) {
    return {
        restrict: 'AE',
        link: function (scope, element, attrs, ctrl) {
            scope.recPerPageList = [10, 20, 50, 100];
            scope.recPerPage = scope.recPerPageList[0];
            scope.currentPage = 1;
            scope.pageList = 1;
            scope.pageHide = true;

            scope.pageSelect = function (type) {

                if (type === 'previous') {
                    scope.currentPage = (scope.currentPage === 1) ? 1 : scope.currentPage - 1;
                } else if (type === 'next') {
                    scope.currentPage = (scope.currentPage === scope.pageList) ? scope.pageList : scope.currentPage + 1;
                } else if (type === 'first') {
                    scope.currentPage = 1;
                } else if (type === 'last') {
                    scope.currentPage = scope.pageList;
                }
                scope.calculatePageRange();

            }

            scope.recPerPageSelect = function (recListNo) {
                scope.recPerPage = scope.recPerPageList[recListNo];
                var html = scope.calculatePagination(scope[attrs.paginationTable]);
                var replaceElement = document.getElementById("paging-section");
                angular.element(replaceElement).replaceWith($compile(html)(scope));
                scope.pageSelect('first');
            }

            scope.calculatePageRange = function () {
                if (scope.PageRecTotal > 0) {
                    scope.PageRecFrom = (scope.recPerPage * (scope.currentPage - 1)) + 1;
                    scope.PageRecTo = (scope.recPerPage * scope.currentPage);
                    scope.PageRecTo = (scope.PageRecTo < scope.PageRecTotal) ? scope.PageRecTo : scope.PageRecTotal;
                }
            }

            scope.calculatePagination = function (listObj) {

                let recPerPageList = '';
                scope.PageRecFrom = 0;
                scope.PageRecTo = 0;
                scope.PageRecTotal = (listObj) ? listObj.length : 0;

                scope.pageList = Math.ceil(scope.PageRecTotal / scope.recPerPage);

                scope.calculatePageRange();

                for (var i = 0; i < scope.recPerPageList.length; i++) {
                    recPerPageList = recPerPageList +
                        '<li ng-class="{' +
                        '\'active\': recPerPage==' + scope.recPerPageList[i] + ',' +
                        '}"> ' +
                        '   <a class="pointer-link" ng-click="recPerPageSelect(' + i + ')">' +
                        scope.recPerPageList[i] +
                        '   </a>' +
                        '</li>';
                }

                return html = '<div class="paging-section" id="paging-section"> ' +
                    '    <div class="page-selection"> ' +
                    '        <nav aria-label="Page navigation"> ' +
                    '           <div class="recperpage-container pagination">' +
                    '            <ul class="pagination custom-pagination recperpagehead"> ' +
                    '               <li>' +
                    '                   <a class="pointer-link">' +
                    '                       {{PageRecFrom}} - {{PageRecTo}} of {{PageRecTotal}}' +
                    '                   </a>' +
                    '               </li>' +
                    '            </ul> ' +
                    '            <ul class="pagination custom-pagination recperpagelist"> ' +
                    '                ' + recPerPageList + ' ' +
                    '            </ul> ' +
                    '           </div>' +
                    '        </nav> ' +
                    '    </div> ' +
                    '    <div class="pagination-container"> ' +
                    '        <nav aria-label="Page navigation"> ' +
                    '            <ul class="pagination"> ' +
                    '               <li> ' +
                    '                   <a class="pointer-link" ng-click="pageSelect(\'first\')" aria-label="first"> ' +
                    '                     <span class="glyphicon glyphicon-fast-backward" aria-hidden="true"></span> ' +
                    '                   </a> ' +
                    '               </li> ' +
                    '               <li> ' +
                    '                   <a class="pointer-link" ng-click="pageSelect(\'previous\')" aria-label="Previous"> ' +
                    '                     <span class="glyphicon glyphicon-backward" aria-hidden="true"></span> ' +
                    '                   </a> ' +
                    '               </li> ' +
                    '            </ul> ' +
                    '            <ul class="pagination"> ' +
                    '               <li><label class="pagination-text custom-label">{{currentPage}} of {{pageList}}</label></li> ' +
                    '            </ul> ' +
                    '            <ul class="pagination"> ' +
                    '               <li> ' +
                    '                   <a class="pointer-link" ng-click="pageSelect(\'next\')" aria-label="Next"> ' +
                    '                     <span class="glyphicon glyphicon-forward" aria-hidden="true"></span> ' +
                    '                   </a> ' +
                    '               </li> ' +
                    '               <li> ' +
                    '                   <a class="pointer-link" ng-click="pageSelect(\'last\')" aria-label="last"> ' +
                    '                     <span class="glyphicon glyphicon-fast-forward" aria-hidden="true"></span> ' +
                    '                   </a> ' +
                    '               </li> ' +
                    '            </ul> ' +
                    '        </nav> ' +
                    '    </div> ' +
                    '</div>';

            }

            scope.$watch(attrs.paginationTable, function (newVal, oldVal) {
                if (newVal != oldVal) {

                    var html = scope.calculatePagination(newVal);
                    var replaceElement = document.getElementById("paging-section");
                    if (replaceElement) {
                        angular.element(replaceElement).replaceWith($compile(html)(scope));
                    } else {
                        angular.element(element[0]).append($compile(html)(scope));
                    }

                }
            }, true)

        }
    }
})

app.filter('paginationRecs', function () {
    return function (input, currentPage, recPerPage) {
        var output = [];
        angular.forEach(input, function (item, index) {
            if ((index >= recPerPage * (currentPage - 1)) && (index <= (recPerPage * currentPage) - 1)) {
                output.push(item);
            }
        })

        return output;
    }
})

app.directive('datetimepickerNeutralTimezone', function () {
    return {
        restrict: 'A',
        priority: 1,
        require: 'ngModel',
        link: function (scope, element, attrs, ctrl) {
            ctrl.$formatters.push(function (value) {
                var date = new Date(Date.parse(value));
                date = new Date(date.getTime() + (60000 * date.getTimezoneOffset()));
                return date;
            });

            ctrl.$parsers.push(function (value) {
                var date = new Date(value.getTime() - (60000 * value.getTimezoneOffset()));
                return date;
            });
        }
    };
});

app.directive('formatNumeric', function () {
    return {
        restrict: 'A',
        priority: 1,
        require: 'ngModel',
        link: function (scope, element, attrs, ctrl) {

            ctrl.$parsers.push(function (value) {
                var clean = value.replace(/([^0-9.]+)/g, '');
                if (value !== clean) {
                    ctrl.$setViewValue(clean);
                    ctrl.$render();
                }
                return clean;
            });
            element.bind('keypress', function (event) {
                if (event.keyCode === 32) {
                    event.preventDefault();
                }
            });
        }
    }
})

app.directive('convertToNumber', function () {
    return {
        require: 'ngModel',
        link: function (scope, element, attrs, ngModel) {
            ngModel.$parsers.push(function (val) {
                return parseInt(val, 10);
            });
            ngModel.$formatters.push(function (val) {
                return '' + val;
            });
        }
    };
});

app.filter("range", function () {
    return function (input, total) {
        var rangeFilter = [];
        total = parseInt(total);
        let count = 0;

        angular.forEach(input, function (item) {
            count++;
            if (count <= total) {
                rangeFilter.push(item);
            }
        })

        return rangeFilter;
    };
})

app.filter('unique', function () {
    return function (collection, keyname) {
        var output = [],
            keys = [];

        angular.forEach(collection, function (item) {
            var key = item[keyname];
            if (keys.indexOf(key) === -1) {
                keys.push(key);
                output.push(item);
            }
        });

        return output;
    };
});

app.directive('draggable', function () {
    return function (scope, element) {
        // this gives us the native JS object
        var el = element[0];

        el.draggable = true;

        el.addEventListener(
            'dragstart',
            function (e) {
                e.dataTransfer.effectAllowed = 'move';
                e.dataTransfer.setData('Text', this.id);
                this.classList.add('drag');
                return false;
            },
            false
        );

        el.addEventListener(
            'dragend',
            function (e) {
                this.classList.remove('drag');
                return false;
            },
            false
        );
    }
});

app.directive('droppable', function () {
    return {
        scope: {
            drop: '&',
            bin: '='
        },
        link: function (scope, element) {
            // again we need the native object
            var el = element[0];

            el.addEventListener(
                'dragover',
                function (e) {
                    e.dataTransfer.dropEffect = 'move';
                    // allows us to drop
                    if (e.preventDefault) e.preventDefault();
                    //this.classList.add('over');
                    var binId = this.id;
                    scope.$apply(function (scope) {
                        var fn = scope.drop();
                        if ('undefined' !== typeof fn) {
                            fn(binId, binId);
                        }
                    });
                    return false;
                },
                false
            );

            el.addEventListener(
                'dragenter',
                function (e) {
                    //this.classList.add('over');
                    return false;
                },
                false
            );

            el.addEventListener(
                'dragleave',
                function (e) {
                    //this.classList.remove('over');
                    return false;
                },
                false
            );

            el.addEventListener(
                'drop',
                function (e) {
                    // Stops some browsers from redirecting.
                    if (e.stopPropagation) e.stopPropagation();

                    this.classList.remove('over');

                    var binId = this.id;
                    //var item = document.getElementById(e.dataTransfer.getData('Text'));
                    this.appendChild(item);
                    // call the passed drop function
                    scope.$apply(function (scope) {
                        var fn = scope.drop();
                        if ('undefined' !== typeof fn) {
                            fn(item.id, binId);
                        }
                    });

                    return false;
                },
                false
            );
        }
    }
});