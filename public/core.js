/* global angular */
angular.module("app", ["googlechart"])
.controller("GenericChartCtrl", function ($http, $scope) {

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
        },
        {
            id: 'lucio',
            label: 'Lucio'
        },
        {
            id: 'torbjorn',
            label: 'Torbjorn'
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
    $scope.maxNumOfPlayers = 6;

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
        return ($scope.currentHero.id === 'all') || (($scope.currentHero.id === hero) && ($scope["myChartObject_" + $scope.selectedMode() + "_" + hero].hasData));
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

    $scope.getColorOrder = function(hero) {
        var colors = [];
        for (var i=0; i < $scope.data[hero].length; i++) {
            var player = $scope.data[hero][i].name;
            if (player == 'Zaralus')
                colors.push('#F17CB0');
            else if(player =='NorthernYeti')
                colors.push('#4D4D4D');
            else if (player == 'MegaArcon')
                colors.push('#B276B2');
            else if (player == 'noj')
                colors.push('#5DA5DA');
            else if (player == 'Nuuga')
                colors.push('#60BD68');
            else if (player == 'Nemisari')
                colors.push('#FAA43A');
            else if (player == 'Lawbringer')
                colors.push('#F15854')
            else if (player == 'Nick')
                colors.push('#B2912F')
            else if(player == 'Dirtnapper')
                colors.push('grey');
            else if(player == 'Isoulle')
                colors.push('#DECF3F');
            else if(player == 'Suracis')
                colors.push('red');
            else
                colors.push('black');
        }
        console.log(colors);
        return colors;
        //return ['red', 'blue'];
    }

    $scope.loadChart = function (hero) {
        var playMode = $scope.selectedMode.id;

        $scope["myChartObject_" + playMode + "_" + hero] = {};
        $scope["myChartObject_" + playMode + "_" + hero].data = $scope.initChartData();
        $scope["myChartObject_" + playMode + "_" + hero].type = "ColumnChart";
        $scope["myChartObject_" + playMode + "_" + hero].hasData = true;

        if (!(hero in $scope.data)) {
            $scope["myChartObject_" + playMode + "_" + hero].data = $scope.initDummyChartData();
            $scope["myChartObject_" + playMode + "_" + hero].hasData = false;
        }

        $scope["myChartObject_" + playMode + "_" + hero].show = ($scope.currentHero.id === 'all') || (($scope.currentHero.id === hero) && ($scope["myChartObject_" + $scope.selectedMode() + "_" + hero].hasData))

        if (!$scope["myChartObject_" + playMode + "_" + hero].hasData)
            return;

        $scope["myChartObject_" + playMode + "_" + hero].options = {
            title : hero,
            colors: $scope.getColorOrder(hero)
        };

        //$scope.fillOutMissingData($scope.data[hero]);
        var barCount = $scope.maxNumOfPlayers;
        if ( barCount > $scope.data[hero].length)
            barCount = $scope.data[hero].length;

        for (var i=0; i < barCount; i++) {
            $scope["myChartObject_" + playMode + "_" + hero].data.cols.push({
                id: "s", label: $scope.data[hero][i].name, type: "number"
            });

            var keys = Object.keys($scope.data[hero][i]['stats'])
            for (var j = 1; j < keys.length; j++) {
                $scope["myChartObject_" + playMode + "_" + hero].data.rows[j - 1].c[0].v = keys[j].replace(/_/g, ' ');
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
                    $scope["myChartObject_" + playMode + "_" + hero].data.rows[j - 1].c.push({v : values[k]});
                }
            }
        }
    }

    $scope.loadCharts = function () {
        for (var i=0; i < $scope.heroes.length; i++) {
            $scope.loadChart($scope.heroes[i].id);
        }
    }

    $scope.init = function () {
        $scope.loadPlayMode();
    };

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

    $scope.initDummyChartData = function() {
        return {
            "cols": [
                { id: "t", label: "Pharah", type: "string" },
                { id: "t", label: "Dummy", type: "number" }
            ], "rows": [
                {
                    c: [
                        { v: "dummy" },
                        { v: "0"}
                    ]
                },
                {
                    c: [
                        { v: "dummy" },
                        { v: "0"}
                    ]
                },
                {
                    c: [
                        { v: "dummy" },
                        { v: "0"}
                    ]
                },
                {
                    c: [
                        { v: "dummy" },
                        { v: "0"}
                    ]
                },
                {
                    c: [
                        { v: "dummy" },
                        { v: "0"}
                    ]
                },
                {
                    c: [
                        { v: "dummy" },
                        { v: "0"}
                    ]
                }
            ]
        };
    }

    //$scope.loadPlayMode();

});
