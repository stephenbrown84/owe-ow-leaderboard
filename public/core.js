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

    $scope.fillOutMissingData = function(data) {
        var count = data.length;
        for (var i=(count); i < 2; i++) {
            data.push({});
            data[i].name = "N/A";
            data[i].overall = 0.0;
            data[i].stats = {};

            var keys = Object.keys(data[0].stats);
            for (var j = 0; j < keys.length; j++) {
                data[i].stats[keys] = 0.0;
            }
        }
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

        //$scope.fillOutMissingData($scope.data[hero]);

        for (var i=0; i < $scope.data[hero].length; i++) {
            $scope["myChartObject_" + hero].data.cols.push({
                id: "s", label: $scope.data[hero][i].name, type: "number"
            });

            var keys = Object.keys($scope.data[hero][i]['stats'])
            for (var j = 1; j < keys.length; j++) {
                $scope["myChartObject_" + hero].data.rows[j - 1].c[0].v = keys[j].replace(/_/g, ' ');
                var values = [];
                values.push($scope.data[hero][i]['stats'][keys[j]])

                /*
                if ((value1 > 1000) || (value2 > 1000)) {
                    value1 = value1 / 1000;
                    value2 = value2 / 1000;
                }
                else if ((value1 > 100) || (value2 > 100)) {
                    value1 = value1 / 100;
                    value2 = value2 / 100;
                }
                */

                for (var k=0; k < values.length; k++) {
                    $scope["myChartObject_" + hero].data.rows[j - 1].c.push({v : values[k]});
                }
            }
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
                { id: "t", label: "Pharah", type: "string" }
            ], "rows": [
                {
                    c: [
                        { v: "" }
                    ]
                },
                {
                    c: [
                        { v: "" }
                    ]
                },
                {
                    c: [
                        { v: "" }
                    ]
                },
                {
                    c: [
                        { v: "" }
                    ]
                },
                {
                    c: [
                        { v: "" }
                    ]
                },
                {
                    c: [
                        { v: "" }
                    ]
                }
            ]
        };
    }

    //$scope.loadPlayMode();

});
