/* global angular */
angular.module("app", ["googlechart"])
.controller("GenericChartCtrl", function ($http, $scope) {
    $scope.myChartObject = {};

    $scope.myChartObject.type = "BarChart";

    $scope.heroOptions =  [
        {
            id: 'all',
            label: 'All Heroes'
        },
        {
            id: 'pharah',
            label: 'Pharah'
        },
        {
            id: 'reaper',
            label: 'Reaper'
        },
        {
            id: 'soldier76',
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
            id: 'dva',
            label: 'D.Va'
        },
        {
            id: 'symmetra',
            label: 'Symmetra'
        }
        ,
        {
            id: 'zarya',
            label: 'Zarya'
        }
    ];

    $scope.modes = [
        {
            id: 'quickplay',
            label: 'Quick Play'
        },
        {
            id: 'competitive',
            label: 'Competitive'
        }
    ];

    $scope.selectedMode = $scope.modes[0];

    $scope.heroes = $scope.heroOptions.slice(1);

    $scope.currentHero = $scope.heroOptions[0];

    $scope.quickplayData;
    $scope.competitiveData;
    $scope.data;
    $http({ method: 'GET', url: '/stats/raw/quickplay' }).success(function (data, status, headers, config) {
        $scope.quickplayData = data;
        $scope.data = data;
        $http({ method: 'GET', url: '/stats/raw/competitive' }).success(function (data, status, headers, config) {
            $scope.competitiveData = data;
            $scope.loadCharts();

        });

    });

    $scope.loadPlayMode = function() {
        $scope.data = $scope[$scope.selectedMode.id + 'Data'];
        $scope.loadCharts();
    }

    $scope.shouldShow = function(hero) {
        return ($scope.currentHero.id === 'all') || ($scope.currentHero.id === hero);
    }

    $scope.loadChart = function (hero) {

        $scope["myChartObject_" + hero] = {};
        $scope["myChartObject_" + hero].data = $scope.initChartData();
        $scope["myChartObject_" + hero].type = "BarChart";
        $scope["myChartObject_" + hero].options = {title : hero};

        $scope["myChartObject_" + hero].data.cols[1].label = $scope.data[hero][0].name
        $scope["myChartObject_" + hero].data.cols[2].label = $scope.data[hero][1].name
        var keys = Object.keys($scope.data[hero][0])
        for (var i = 1; i < keys.length; i++) {
            $scope["myChartObject_" + hero].data.rows[i - 1].c[0].v = keys[i];
            var value1 = $scope.data[hero][0][keys[i]];
            var value2 = $scope.data[hero][1][keys[i]];

            if ((value1 > 1000) || (value2 > 1000)) {
                value1 = value1 / 1000;
                value2 = value2 / 1000;
            }
            else if ((value1 > 100) || (value2 > 100)) {
                value1 = value1 / 100;
                value2 = value2 / 100;
            }
            $scope["myChartObject_" + hero].data.rows[i - 1].c[1].v = value1;
            $scope["myChartObject_" + hero].data.rows[i - 1].c[2].v = value2;
        }
    }

    $scope.loadCharts = function () {
        for (var i=0; i < $scope.heroes.length; i++) {
            $scope.loadChart($scope.heroes[i].id);
        }
    }

    $scope.initChartData = function() {
        return {
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
    }

});
