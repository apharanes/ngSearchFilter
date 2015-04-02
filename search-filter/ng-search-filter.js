/**
 * Created by jeanella on 3/26/2015.
 */

var ngSearchFilter = angular.module('ngSearchFilter', []);

angular.module('ngSearchFilter')

/** parameters as attributes
 * - collection: The collection to be filtered
 * - filters: An array of filters that will be used on the collection
 */
    .directive('searchFilter', function(){
        return {
            restrict: 'E',
            templateUrl: 'search-filter/filter.html',
            transclude: true,
            scope: {
                collection: '=',
                filters: '=',
                keywordFields: '='
            },
            controller: 'SearchFilterCtrl'
        };
    })

/** scope variables passed from the directive attributes:
 *  - collection
 *  - filters
 *  - keywordFields
 */
    .controller('SearchFilterCtrl', ['$scope','$filter', function($scope, $filter){
        $scope.searchKeyword = '';
        $scope.isActiveSearch = false;
        $scope.collectionFields = [];

        $scope.$watch('collection', function(newCollection){
            $scope.collectionFields = $scope.getFields(angular.copy(newCollection));
            $scope.countFilters($scope.collection);
        });

        // Fetch fields of a collection item to be used as html Table column headers
        $scope.getFields = function(collection){
            return _.keys(angular.copy(collection[0]));
        };

        // This function is called when iterating through the html Table rows
        $scope.getValues = function(item){
            return _.values(angular.copy(item));
        };

        // Selects multiple filters
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

        // Clears search and sets filters to default values (All)
        $scope.clearFilters = function(){
            $scope.searchKeyword = '';

            _.each($scope.filters, function(filter){
                _.each(filter.values, function(value){
                    value.isActive = value.isAll;
                });
            });
            $scope.isActiveSearch = false;
        };

        // Called to initialize static total count for each filter in the UI
        $scope.countFilters = function(collection){

            var countFilter = function(collection, filter, value){
                console.log(filter);
                var filters = [],
                    values = [],
                    valueToCount = angular.copy(value),
                    filterToCount = angular.copy(filter);

                valueToCount.isActive = true;

                values.push(valueToCount);
                _.extend(filterToCount, { values: values });
                filters.push(filterToCount);

                return $filter('FilterByCategory')(collection, filters, filter.category).length;
            };

            _.each($scope.filters, function(filter){
                _.each(filter.values, function(value){
                    value.count = countFilter(collection, filter, value);
                });
            });
        };
    }])

    // Enables to filter category by field or by a set of fields in an object
    .filter('FilterByCategory', function(){
        return function(collection, filters, category){
            var filteredCollection = [],
                filter = _.findWhere(filters, { category: category}),
                general = _.findWhere(filter.values, { isAll: true });

            // Simply return original collection if 'isAll' filter is active
            if(!_.isUndefined(general)){
                if(general.isActive){
                    filteredCollection = collection;
                }
            }

            // Iterate through each possible filters in the selected category
            var others = _.findWhere(filter.values, { isAll: false });
            if(!_.isUndefined(others)) {
                _.each(_.where(filter.values, { isActive: true, isAll: false }), function (value) {
                    _.each(collection, function (item) {
                        if(_.isArray(item[filter.object])){
                            if(filter.which == 'collection'){
                                _.each(item[filter.object], function(objectItem){
                                    if(_.isEqual(objectItem[filter.field],value.fieldEval) && !_.contains(filteredCollection, item)){
                                        filteredCollection.push(item);
                                    }
                                });
                            } else {
                                if(_.isEqual(item[filter.object][filter.which][filter.field],value.fieldEval) && !_.contains(filteredCollection, item)){
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
    })

/** Iterates through a set of fields of a collection to check for matches to the keyword
 * @param {collection} - Collection to be searched through
 * @param {fields} - Array of string fields of the collection item where you want to check keywords against
 * @param {keyword} - Keyword to be searched in each field of each collection item
 *
 * @return {FilteredCollection}
 */
    .filter('KeywordSearchFilter', function(){
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
                            // at least one of the keywords don't appear in the search input
                            return false;
                        }
                    }

                    // all keywords exist in the search input
                    return true;
                });

            }else{
                return collection;
            }
        }
    });
