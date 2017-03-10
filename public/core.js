/* global angular */
angular.module("app", ["googlechart", "rzModule", 'ui.bootstrap', 'ngSanitize'])
.controller("GenericChartCtrl", function ($http, $scope) {

    $scope.heroOptions =  [
        {
            id: 'all',
            label: 'All Heroes'
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
            id: 'sombra',
            label: 'Sombra'
        },
        {
            id: 'tracer',
            label: 'Tracer'
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
            id: 'junkrat',
            label: 'Junkrat'
        },
        {
            id: 'mei',
            label: 'Mei'
        },
        {
            id: 'torbjorn',
            label: 'Torbjorn'
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
            id: 'reinhardt',
            label: 'Reinhardt'
        },
        {
            id: 'roadhog',
            label: 'Roadhog'
        },
        {
            id: 'winston',
            label: 'Winston'
        },
        {
            id: 'zarya',
            label: 'Zarya'
        },
        {
            id: 'ana',
            label: 'Ana'
        },
        {
            id: 'lucio',
            label: 'Lucio'
        },
        {
            id: 'mercy',
            label: 'Mercy'
        },
        {
            id: 'zenyatta',
            label: 'Zenyatta'
        },
        {
            id: 'symmetra',
            label: 'Symmetra'
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

    $scope.slider = {
        minValue: 1,
        maxValue: 4,
        options: {
            floor: 1,
            ceil: 12,
            step: 1,
            showTicksValues: true,
            translate: function (value) {
                if (isNaN(value))
                    return 'NaN'
                else if (value == 1)
                    return value + '<b>st</b>';
                else if (value == 2)
                    return value + '<b>nd</b>';
                else if (value == 3)
                    return value + '<b>rd</b>';
                else
                    return value + '<b>th</b>';
            }
        }
    };

    $scope.$watch('slider.minValue', function () {
        $scope.loadPlayMode();
    });

    $scope.$watch('slider.maxValue', function () {
        $scope.loadPlayMode();
    });

    $scope.selectedMode = $scope.modes[0];
    //$scope.maxNumOfPlayers = 4;

    $scope.heroes = $scope.heroOptions.slice(1);

    $scope.currentHero = $scope.heroOptions[0];

    $scope.quickplayData;
    $scope.competitiveData;
    $scope.data = null;
    $scope.isDataReady = false;

    $scope.setCurrentHero = function(h) {
        $scope.currentHero = h;
        $scope.loadPlayMode();
    }

    $scope.shouldShow = function(hero, playMode) {
        return ($scope.selectedMode.id == playMode) && $scope["myChartObject_" + $scope.selectedMode.id + "_" + hero].hasData && (($scope.currentHero.id === 'all') || ($scope.currentHero.id === hero));
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

    $scope.getColorOrder = function(hero, minBarCount, maxBarCount) {
        var colors = [];
        for (var i = minBarCount - 1; i < maxBarCount; i++) {
            var player = $scope.data[hero][i].name;
            if (player == 'Zaralus')
                colors.push('#F17CB0');
            else if(player =='NorthernYeti')
                colors.push('sienna');
            else if (player == 'MegaArcon')
                colors.push('#B276B2');
            else if (player == 'noj')
                colors.push('#5DA5DA');
            else if (player == 'Nuuga')
                colors.push('#60BD68');
            else if (player == 'Nemisari')
                colors.push('#FAA43A');
            else if (player == 'Lawbringer')
                colors.push('#FFE135')
            else if (player == 'Nick')
                colors.push('#B2912F')
            else if(player == 'Dirtnapper')
                colors.push('grey');
            else if(player == 'Isoulle')
                colors.push('lightblue');
            else if(player == 'Suracis')
                colors.push('tomato');
            else
                colors.push('black');
        }
        //console.log(colors);
        return colors;
        //return ['red', 'blue'];
    }

    $scope.loadChart = function (hero, playMode) {

        if (!(("myChartObject_" + playMode + "_" + hero) in $scope))
            $scope["myChartObject_" + playMode + "_" + hero] = {};

        $scope["myChartObject_" + playMode + "_" + hero].data = $scope.initChartData();
        $scope["myChartObject_" + playMode + "_" + hero].type = "ColumnChart";
        $scope["myChartObject_" + playMode + "_" + hero].hasData = true;

        if (!$scope.data || !(hero in $scope.data)) {
            $scope["myChartObject_" + playMode + "_" + hero].data = $scope.initDummyChartData();
            $scope["myChartObject_" + playMode + "_" + hero].hasData = false;
        }

        //$scope["myChartObject_" + playMode + "_" + hero].show = (playMode == 'quickplay');
        $scope["myChartObject_" + playMode + "_" + hero].options = {};
        $scope["myChartObject_" + playMode + "_" + hero].options.title = hero;
        $scope["myChartObject_" + playMode + "_" + hero].options.chartArea = { 'left': '5%' };
        $scope["myChartObject_" + playMode + "_" + hero].options.legend = { 'position': 'right' };


        if (!$scope["myChartObject_" + playMode + "_" + hero].hasData)
            return;

        //$scope.fillOutMissingData($scope.data[hero])
        var maxbarCount = $scope.slider.maxValue;
        var minbarCount = $scope.slider.minValue;
        if (maxbarCount > $scope.data[hero].length)
            maxbarCount = $scope.data[hero].length;

        $scope["myChartObject_" + playMode + "_" + hero].options.colors = $scope.getColorOrder(hero, minbarCount, maxbarCount);

        // Set up column labels
        var keys = Object.keys($scope.data[hero][0]['stats'])
        for (var j = 0; j < keys.length; j++) {
            $scope["myChartObject_" + playMode + "_" + hero].data.rows.push({c: [{v: ""}]});
            $scope["myChartObject_" + playMode + "_" + hero].data.rows[j].c[0].v = keys[j].replace(/_/g, ' ');
        }

        // Set up number data
        for (var i = minbarCount - 1; i < maxbarCount; i++) {
            $scope["myChartObject_" + playMode + "_" + hero].data.cols.push({
                id: "s", label: $scope.data[hero][i].name, type: "number"
            });

            for (var j = 0; j < keys.length; j++) {;
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
                    $scope["myChartObject_" + playMode + "_" + hero].data.rows[j].c.push({v : values[k]});
                }
            }
        }
    }

    $scope.loadCharts = function (playMode) {
        $scope.data = $scope[playMode + 'Data'];
        for (var i=0; i < $scope.heroes.length; i++) {
            $scope.loadChart($scope.heroes[i].id, playMode);
        }
    }

    $scope.loadAllCharts = function() {
        $scope.loadCharts('competitive');
        $scope.loadCharts('quickplay');
        $scope.loadPlayMode();
    }

    $scope.loadPlayMode = function () {
        $scope.loadCharts($scope.selectedMode.id);
        for (var i=0; i < $scope.heroes.length; i++) {
            var hero = $scope.heroes[i];

            if (!(("myChartObject_quickplay_" + hero.id) in $scope)) {
                $scope["myChartObject_quickplay_" + hero.id] = {};
            }
            if (!(("myChartObject_competitive_" + hero.id) in $scope)) {
                $scope["myChartObject_competitive_" + hero.id] = {};
            }
                
            $scope["myChartObject_quickplay_" + hero.id].show = $scope.shouldShow(hero.id, 'quickplay');
            $scope["myChartObject_competitive_" + hero.id].show = $scope.shouldShow(hero.id, 'competitive');
        }
    }

    $scope.init = function () {
        $scope.getDataFromServer();
    };

    $scope.getDataFromServer = function() {
        $http({ method: 'GET', url: '/stats/sorted' }).then(function successCallback(response) {
            if (Object.keys(response.data) < 1) {
                setTimeout($scope.getDataFromServer, 2000);
                return;
            }
            $scope.quickplayData = response.data.quickplay;
            $scope.competitiveData = response.data.competitive;
            $scope.loadPlayMode();
            $scope.isDataReady = true;
        }, function errorCallback(response) {
            // called asynchronously if an error occurs
            // or server returns response with an error status.
        });
    }

    $scope.initChartData = function() {
        return {
            "cols": [
                { id: "t", label: "Pharah", type: "string" }
            ], "rows": [
                /*
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
                },
                {
                    c: [
                        { v: "" }
                    ]
                }
                */
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

});
