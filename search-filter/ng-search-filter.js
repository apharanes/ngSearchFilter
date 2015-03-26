/**
 * Created by jeanella on 3/26/2015.
 */

var ngSearchFilter = angular.module('ngSearchFilter', []);

ngSearchFilter.directive('searchFilter', function(){
    return {
        restrict: 'E',
        templateUrl: 'search-filter/filter.html',
        transclude: true,
        scope: {
            collection: '=searchFilter',
            filters: '='
        },
        controller: 'SearchFilterCtrl'
    };
});

ngSearchFilter.controller('SearchFilterCtrl', ['$scope',
    function($scope){
        $scope.searchTitle = '';
        $scope.isActiveSearch = false;

        $scope.toggleFilter = function(filter, value){
            var general = _.findWhere(filter.values, { isAll: true});

            if(value.isActive){
                if(!value.isAll){
                    if(_.where(filter.values, { isActive: true}).length <= 1){
                        general.isActive = true;
                    }
                    value.isActive = !value.isActive;
                }
            } else {
                if(value.isAll){
                    _.each(_.where(filter.values, { isAll: false}), function(filterValue){
                        filterValue.isActive = false;
                    });
                } else {
                    general.isActive = false;
                }
                value.isActive = !value.isActive;
            }

            $scope.isActiveSearch = (!general.isActive || value.isActive) && !value.isAll;
        };

        $scope.clearFilters = function(){
            $scope.searchTitle = '';

            _.each($scope.filters, function(filter){
                _.each(filter.values, function(value){
                    value.isActive = value.isAll;
                });
            });
            $scope.isActiveSearch = false;
        };

        $scope.countFilters = function(){
            _.each($scope.filters, function(filter){
                _.each(filter.values, function(value){
                    value.count = $scope.countFilter(filter, value);
                });
            });
        };

        $scope.countFilter = function(filter, value){
            var filters = [];
            var values = [];
            var valueToCount = angular.copy(value);
            var filterToCount = angular.copy(filter);
            valueToCount.isActive = true;

            values.push(valueToCount);
            _.extend(filterToCount, { values: values });
            filters.push(filterToCount);
            return $filter('TitleFilter')($scope.titles, filters, filter.category).length;
        };
    }]);

ngSearchFilter.filter('KeywordSearchFilter', function(){
    return function(collection, filters, category){
        var filteredCollection = [];
        var filter = _.findWhere(filters, { category: category});
        var general = _.findWhere(filter.values, { isAll: true });

        collection = _.filter(collection, function(item) {
            return item.hierarchy !== 'SEASON' && item.hierarchy !== 'EPISODE' && item.id !== "0";
        });

        if(!_.isUndefined(general)){
            if(general.isActive){
                filteredCollection = collection;
            }
        }

        var others = _.findWhere(filter.values, { isAll: false });
        if(!_.isUndefined(others)) {
            _.each(_.where(filter.values, { isActive: true, isAll: false }), function (value) {
                _.each(collection, function (item) {
                    if(_.isArray(item[filter.object])){
                        if(filter.which == 'collection'){
                            _.each(item[filter.object], function(objectItem){

                                if(_.isEqual(objectItem[filter.field].trim(),value.fieldEval.trim()) && !_.contains(filteredCollection, item)){
                                    filteredCollection.push(item);
                                }
                            });
                        } else {
                            if(_.isEqual(item[filter.object][filter.which][filter.field].trim(),value.fieldEval.trim()) && !_.contains(filteredCollection, item)){
                                filteredCollection.push(item);
                            }
                        }
                    } else {
                        if(_.isEqual(item[filter.field],value.fieldEval)){
                            filteredCollection.push(item);
                        }
                    }
                });
            });
        }
        return filteredCollection;
    };
});
