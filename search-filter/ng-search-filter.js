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
            collection: '=',
            filters: '=',
            collectionType: '@'
        },
        controller: 'SearchFilterCtrl'
    };
});

ngSearchFilter.controller('SearchFilterCtrl', ['$scope','$filter',
    function($scope, $filter){
        $scope.searchKeyword = '';
        $scope.isActiveSearch = false;
        $scope.collectionFields = [];

        $scope.$watch('collection', function(newCollection){
            $scope.collectionFields = $scope.getFields(angular.copy(newCollection));
            $scope.countFilters();
        });

        $scope.getFields = function(collection){
            return _.keys(angular.copy(collection[0]));
        };

        $scope.getValues = function(item){
            return _.values(angular.copy(item));
        };

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
            $scope.searchKeyword = '';

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
                    value.count = $scope.countFilter($scope.collection, filter, value);
                });
            });
        };

        $scope.countFilter = function(filter, value){
            console.log(filter);
            var filters = [],
                values = [],
                valueToCount = angular.copy(value),
                filterToCount = angular.copy(filter);

            valueToCount.isActive = true;

            values.push(valueToCount);
            _.extend(filterToCount, { values: values });
            filters.push(filterToCount);

            return $filter('KeywordSearchFilter')($scope.collection, filters, filter.category).length;
        };

        $scope.init = function(){
            console.log($scope.collection);
            $scope.collectionFields = $scope.getFields($scope.collection);
        };

        $scope.init();
    }]);

ngSearchFilter.filter('FilterByCategory', function(){
    return function(collection, filters, category){
        var filteredCollection = [],
            filter = _.findWhere(filters, { category: category}),
            general = _.findWhere(filter.values, { isAll: true });

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

ngSearchFilter.filter('KeywordSearchFilter', function(){
    return function(collection, fields, keywords){
        if(keywords.length > 0){
            // Lowercased to search without case-sensitivity

            keywords = keywords.toLowerCase();
            var keywordSearch = keywords.split(' ');

            return _.filter(collection, function(item){
                var searched = "";

                _.each(fields, function(field){
                    searched = searched.concat(" ",item[field]);
                });

                // Lowercased to search without case-sensitivity
                searched = searched.toLowerCase();

                for(var i=0; i<keywordSearch.length; i++){
                    if(searched.indexOf(keywordSearch[i]) == -1){
                        // at least one of the keywords don't appear in the searchInput
                        return false;
                    }
                }

                // all keywords exist in the searchInput
                return true;
            });
        }else{
            return collection;
        }
    }
});
