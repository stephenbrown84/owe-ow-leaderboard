/* global angular */
angular.module("app", ["googlechart"])
.controller("GenericChartCtrl", function ($http, $scope) {
    $scope.myChartObject = {};

    $scope.myChartObject.type = "BarChart";

    $scope.heroes = [{
        id: 'pharah',
        label: 'Pharah'
    },
    {
        id: 'reaper',
        label: 'Reaper'
    },
    {
        id: 'soldier:_76',
        label: 'Soldier76'
    },
    {
        id: 'reinhardt',
        label: 'Reinhardt'
    },
    {
        id: 'junkrat',
        label: 'Junkrat'
    },
    {
        id: 'mei',
        label: 'Mei'
    },
    {
        id: 'tracer',
        label: 'Tracer'
    },
    {
        id: 'genji',
        label: 'Genji'
    },
    {
        id: 'mccree',
        label: 'McCree'
    },
    {
        id: 'winston',
        label: 'Winston'
    },
    {
        id: 'roadhog',
        label: 'Roadhog'
    },
    {
        id: 'zenyatta',
        label: 'Zenyatta'
    },
    {
        id: 'mercy',
        label: 'Mercy'
    },
    {
        id: 'ana',
        label: 'Ana'
    },
    {
        id: 'sombra',
        label: 'Sombra'
    },
    {
        id: 'bastion',
        label: 'Bastion'
    },
    {
        id: 'hanzo',
        label: 'Hanzo'
    },
    {
        id: 'widowmaker',
        label: 'Widowmaker'
    },
    {
        id: 'd.va',
        label: 'D.Va'
    },
    {
        id: 'symmetra',
        label: 'Symmetra'
    }];

    $scope.currentHero = $scope.heroes[0];

    $scope.myChartObject.data = {
        "cols": [
            { id: "t", label: "Pharah", type: "string" },
            { id: "s", label: "1st Place", type: "number" },
            { id: "t", label: "2nd Place", type: "number" }
        ], "rows": [
            {
                c: [
                   { v: "Mushrooms" },
                   { v: 3 },
                   { v: 3 }
                ]
            },
            {
                c: [
                     { v: "Onions" },
                     { v: 31 },
                     { v: 3 }
                ]
            },
            {
                c: [
                   { v: "Olives" },
                   { v: 31 },
                   { v: 3 }
                ]
            },
            {
                c: [
                   { v: "Zucchini" },
                   { v: 1 },
                   { v: 3 }
                ]
            },
            {
                c: [
                   { v: "Pepperoni" },
                   { v: 2 },
                   { v: 3 }
                ]
            },
            {
                c: [
                   { v: "Pepperoni" },
                   { v: 2 },
                   { v: 3 }
                ]
            }
        ]
    };

    $scope.data;
    $http({ method: 'GET', url: '/stats/raw' }).success(function (data, status, headers, config) {
        $scope.data = data;
        $scope.loadChart('reaper');
        
    });

    $scope.loadChart = function () {
        
        $scope.myChartObject.options.title = $scope.currentHero.label;

        var hero = $scope.currentHero.id;
        $scope.myChartObject.data.cols[1].label = $scope.data[hero][0].name
        $scope.myChartObject.data.cols[2].label = $scope.data[hero][1].name
        var keys = Object.keys($scope.data[hero][0])
        for (var i = 1; i < keys.length; i++) {
            $scope.myChartObject.data.rows[i - 1].c[0].v = keys[i];
            $scope.myChartObject.data.rows[i - 1].c[1].v = $scope.data[hero][0][keys[i]];
            $scope.myChartObject.data.rows[i - 1].c[2].v = $scope.data[hero][1][keys[i]];
        }
    }

    $scope.myChartObject.options = {
        'title': 'Pharah'
    };
});
