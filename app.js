/**
 * Created by jeanella on 3/26/2015.
 */

var app  = angular.module('App', ['ngSearchFilter']);

app.controller('AppCtrl', ['$scope', function($scope){
    $scope.filters = [
        {
            id: 0,
            category: 'Status',
            field: 'status',
            object: 'status',
            values: [
                {name: 'All', isActive: true, isAll: true, fieldEval: '', count: 0},
                {name: 'Rejected', isActive: false, isAll: false, fieldEval: 'REJECTED', count: 0},
                {name: 'Open', isActive: false, isAll: false, fieldEval: 'OPEN', count: 0},
                {name: 'In Progress', isActive: false, isAll: false, fieldEval: 'IN PROGRESS', count: 0},
                {name: 'Submitted', isActive: false, isAll: false, fieldEval: 'SUBMITTED', count: 0},
                {name: 'Completed', isActive: false, isAll: false, fieldEval: 'COMPLETED', count: 0}
            ],
            hasIcon: false
        }
    ];

    $scope.rows = [
        { data: 'Example 1'},
        { data: 'Example 2'}
    ];
}]);