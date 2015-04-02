/**
 * Created by jeanella on 3/19/2015.
 */

ngSearchFilter.filter('FilterByCategory', function(){
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