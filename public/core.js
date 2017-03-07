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
    $scope.data = null;
    $http({ method: 'GET', url: '/stats/sorted' }).success(function (data, status, headers, config) {
        $scope.quickplayData = data.quickplay;
        $scope.competitiveData = data.competitive;
        $scope.data = data.quickplay;
    });

    $scope.loadPlayMode = function() {
        if (!$scope.isDataReady()) return;
        $scope.data = $scope[$scope.selectedMode.id + 'Data'];
        $scope.loadCharts();
    }

    $scope.shouldShow = function(hero) {
        return ($scope.currentHero.id === 'all') || (($scope.currentHero.id === hero) && ($scope["myChartObject_" + hero].hasData));
    }

    $scope.isDataReady = function() {
        if ($scope.data) return true;
        return false;
    }

    $scope.loadChart = function (hero) {

        $scope["myChartObject_" + hero] = {};
        $scope["myChartObject_" + hero].data = $scope.initChartData();
        $scope["myChartObject_" + hero].type = "ColumnChart";
        $scope["myChartObject_" + hero].options = {title : hero};
        $scope["myChartObject_" + hero].hasData = true;

        if (!(hero in $scope.data)) {
            $scope["myChartObject_" + hero].hasData = false;
            return;
        }

        if ($scope.data[hero].length > 0)
            $scope["myChartObject_" + hero].data.cols[1].label = $scope.data[hero][0].name
        else
            $scope["myChartObject_" + hero].data.cols[1].label = "N/A";

        if ($scope.data[hero].length > 1)
            $scope["myChartObject_" + hero].data.cols[2].label = $scope.data[hero][1].name
        else
            $scope["myChartObject_" + hero].data.cols[2].label = "N/A";

        var keys = Object.keys($scope.data[hero][0]['stats'])
        for (var i = 1; i < keys.length; i++) {
            $scope["myChartObject_" + hero].data.rows[i - 1].c[0].v = keys[i];
            var value1 = 0;
            if ($scope.data[hero].length > 0)
                value1 = $scope.data[hero][0]['stats'][keys[i]];

            var value2 = 0;
            if ($scope.data[hero].length > 1)
                var value2 = $scope.data[hero][1]['stats'][keys[i]];

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
                { id: "s", label: "N/A", type: "number" },
                { id: "t", label: "N/A", type: "number" }
            ], "rows": [
                {
                    c: [
                        { v: "" },
                        { v: 0 },
                        { v: 0 }
                    ]
                },
                {
                    c: [
                        { v: "" },
                        { v: 0 },
                        { v: 0 }
                    ]
                },
                {
                    c: [
                        { v: "" },
                        { v: 0 },
                        { v: 0 }
                    ]
                },
                {
                    c: [
                        { v: "" },
                        { v: 0 },
                        { v: 0 }
                    ]
                },
                {
                    c: [
                        { v: "" },
                        { v: 0 },
                        { v: 0 }
                    ]
                },
                {
                    c: [
                        { v: "" },
                        { v: 0 },
                        { v: 0 }
                    ]
                }
            ]
        };
    }

    //$scope.loadPlayMode();

});
