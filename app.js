/**
 * Created by jeanella on 3/26/2015.
 */

var app  = angular.module('App', ['ngSearchFilter']);

app.controller('AppCtrl', ['$scope', function($scope){
    $scope.filters = [
        {
            id: 0,
            category: 'Milk Type',
            field: 'milkType',
            object: 'self',
            values: [
                {name: 'All', isActive: true, isAll: true, fieldEval: '', count: 0},
                {name: 'Cow', isActive: false, isAll: false, fieldEval: 'Cow', count: 0},
                {name: 'Goat', isActive: false, isAll: false, fieldEval: 'Goat', count: 0},
                {name: 'Sheep', isActive: false, isAll: false, fieldEval: 'Sheep', count: 0}
            ],
            hasIcon: false
        }
    ];

    $scope.cheeseList = [
        { name: 'Brie de Meaux', milkType: 'Cow', region: 'Ile-de-France'},
        { name: 'Bleu d\'Auvergne', milkType: 'Cow', region: 'Auvergne'},
        { name: 'Camembert', milkType: 'Cow', region: 'Normandy'},
        { name: 'Mâconnais', milkType: 'Goat', region: 'Burgundy'},
        { name: 'Pont-l\'Évêque', milkType: 'Cow', region: 'Normandy'},
        { name: 'Picodon', milkType: 'Goat', region: 'Rhône-Alpes'},
        { name: 'Rocamadour', milkType: 'Goat', region: 'Midi-Pyrénées'},
        { name: 'Roquefort', milkType: 'Sheep', region: 'Midi-Pyrénées'},
        { name: 'Saint-Nectaire', milkType: 'Cow', region: 'Auvergne'},
        { name: 'Salers', milkType: 'Cow', region: 'Auvergne'}
    ];
}]);