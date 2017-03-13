/* global angular */
angular.module("app", ["googlechart", "rzModule", 'ui.bootstrap', 'ngSanitize'])
.controller("GenericChartCtrl", function ($http, $scope, $timeout) {

    $scope.ROLES = {
        OFFENSE: 'OFFENSE',
        TANK: 'TANK',
        DEFENSE: 'DEFENSE',
        SUPPORT: 'SUPPORT'
    }

    $scope.heroOptions =  [
        {
            id: 'all',
            label: 'All Heroes',
            role: $scope.ROLES.OFFENSE
        },
        {
            id: 'genji',
            label: 'Genji',
            role: $scope.ROLES.OFFENSE
        },

        {
            id: 'mccree',
            label: 'McCree',
            role: $scope.ROLES.OFFENSE
        },
        {
            id: 'pharah',
            label: 'Pharah',
            role: $scope.ROLES.OFFENSE
        },
        {
            id: 'reaper',
            label: 'Reaper',
            role: $scope.ROLES.OFFENSE
        },
        {
            id: 'soldier76',
            label: 'Soldier76',
            role: $scope.ROLES.OFFENSE
        },
        {
            id: 'sombra',
            label: 'Sombra',
            role: $scope.ROLES.OFFENSE
        },
        {
            id: 'tracer',
            label: 'Tracer',
            role: $scope.ROLES.OFFENSE
        },
        {
            id: 'bastion',
            label: 'Bastion',
            role: $scope.ROLES.DEFENSE

        },
        {
            id: 'hanzo',
            label: 'Hanzo',
            role: $scope.ROLES.DEFENSE
        },
        {
            id: 'junkrat',
            label: 'Junkrat',
            role: $scope.ROLES.DEFENSE
        },
        {
            id: 'mei',
            label: 'Mei',
            role: $scope.ROLES.DEFENSE
        },
        {
            id: 'torbjorn',
            label: 'Torbjorn',
            role: $scope.ROLES.DEFENSE
        },
        {
            id: 'widowmaker',
            label: 'Widowmaker',
            role: $scope.ROLES.DEFENSE
        },
        {
            id: 'dva',
            label: 'D.Va',
            role: $scope.ROLES.TANK
        },
        {
            id: 'reinhardt',
            label: 'Reinhardt',
            role: $scope.ROLES.TANK
        },
        {
            id: 'roadhog',
            label: 'Roadhog',
            role: $scope.ROLES.TANK
        },
        {
            id: 'winston',
            label: 'Winston',
            role: $scope.ROLES.TANK
        },
        {
            id: 'zarya',
            label: 'Zarya',
            role: $scope.ROLES.TANK
        },
        {
            id: 'ana',
            label: 'Ana',
            role: $scope.ROLES.SUPPORT
        },
        {
            id: 'lucio',
            label: 'Lucio',
            role: $scope.ROLES.SUPPORT
        },
        {
            id: 'mercy',
            label: 'Mercy',
            role: $scope.ROLES.SUPPORT
        },
        {
            id: 'zenyatta',
            label: 'Zenyatta',
            role: $scope.ROLES.SUPPORT
        },
        {
            id: 'symmetra',
            label: 'Symmetra',
            role: $scope.ROLES.SUPPORT
        }
    ];
    $scope.heroes = $scope.heroOptions.slice(1);

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
            translate: function(value) {
                if (isNaN(value))
                    return 'NaN'
                else if (value == 1)
                    return value + '<sup>st</sup>';
                else if (value == 2)
                    return value + '<sup>nd</sup>';
                else if (value == 3)
                    return value + '<sup>rd</sup>';
                else
                    return value + '<sup>th</sup>';
            }
        }
    };

    $scope.heroClasses = {}

    $scope.seagullAllowedModel = false;

    $scope.isCurrentHero = function(h) {
        return ($scope.currentHero.id == h);
    };

    $scope.getPlaceForNum = function(value) {
        if (isNaN(value))
            return 'NaN'
        else if (value == 1)
            return value + 'st';
        else if (value == 2)
            return value + 'nd';
        else if (value == 3)
            return value + 'rd';
        else
            return value + 'th';
    }

    $scope.getTimePlayedString = function(value) {
        var hours = Math.floor(value/60);
        var mins = value - (hours*60);
        return hours + 'h ' + mins + 'm';
    }

    $scope.refreshSlider = function () {
        $timeout(function () {
            $scope.$broadcast('rzSliderForceRender');
        });
    };

    $scope.$watch('slider.minValue', function () {
        $scope.loadPlayMode();
    });

    $scope.$watch('slider.maxValue', function () {
        $scope.loadPlayMode();
    });

    $scope.selectedMode = $scope.modes[0];
    //$scope.maxNumOfPlayers = 4;

    $scope.quickplayData;
    $scope.competitiveData;
    $scope.data = null;
    $scope.isDataReady = false;

    $scope.setCurrentHero = function(h) {
        $scope.currentHero = h;
        $scope.clearHeroClasses();
        $scope.heroClasses[h.id] = 'card-hero-icon-selected';
        $scope.loadPlayMode();
    }

    $scope.clearHeroClasses = function() {
        for (var i=0; i < $scope.heroOptions.length; i++) {
            $scope.heroClasses[$scope.heroOptions[i].id] = 'card-hero-icon';
        }
    }

    $scope.shouldShow = function(hero, playMode) {
        return ($scope.selectedMode.id == playMode) && (($scope.currentHero.id === 'all') || ($scope.currentHero.id === hero));
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
            else if (player == 'Seagull')
                if ($scope.seagullAllowedModel) {
                    colors.push('purple');
                }
                else {
                    if (maxBarCount !== $scope.data[hero].length) {
                        maxBarCount += 1;
                    }
                }
                    
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
        $scope["myChartObject_" + playMode + "_" + hero].options.tooltip = { 'isHTML': true };
        $scope["myChartObject_" + playMode + "_" + hero].options.vAxis = {format:'#%'};



        if (!$scope["myChartObject_" + playMode + "_" + hero].hasData)
            return;

        //$scope.fillOutMissingData($scope.data[hero])
        var maxbarCount = $scope.slider.maxValue;
        var minbarCount = $scope.slider.minValue;
        if (maxbarCount > $scope.data[hero].length)
            maxbarCount = $scope.data[hero].length;

        if (minbarCount > maxbarCount) {
            $scope["myChartObject_" + playMode + "_" + hero].data = $scope.initDummyChartData();
            $scope["myChartObject_" + playMode + "_" + hero].hasData = false;
            return;
        }

        if (!$scope.seagullAllowedModel && ($scope.data[hero].length == 1) && ($scope.data[hero][0].name == 'Seagull')) {
            $scope["myChartObject_" + playMode + "_" + hero].data = $scope.initDummyChartData();
            $scope["myChartObject_" + playMode + "_" + hero].hasData = false;
            return;
        }

        $scope["myChartObject_" + playMode + "_" + hero].options.colors = $scope.getColorOrder(hero, minbarCount, maxbarCount);

        // Set up column labels
        var keys = Object.keys($scope.data[hero][0]['stats'])
        for (var j = 0; j < keys.length; j++) {
            // Data Column
            $scope["myChartObject_" + playMode + "_" + hero].data.rows.push({c: [{v: ""}]});
            $scope["myChartObject_" + playMode + "_" + hero].data.rows[j].c[0].v = keys[j].replace(/_/g, ' ');
        }

        // Set up number data
        for (var i = minbarCount - 1; i < maxbarCount; i++) {
            if (!$scope.seagullAllowedModel && $scope.data[hero][i].name == 'Seagull') {
                if (maxbarCount !== $scope.data[hero].length) {
                    maxbarCount += 1;
                } 
                continue;
            }

            $scope["myChartObject_" + playMode + "_" + hero].data.cols.push({
                id: "s", label: ($scope.data[hero][i].name + ' (' + $scope.getTimePlayedString($scope.data[hero][i]['time_played']) + ')'), type: "number"
            });


            $scope["myChartObject_" + playMode + "_" + hero].data.cols.push({
                role: 'tooltip', type: "string", p: { 'html': true }
            });

            for (var j = 0; j < keys.length; j++) {

                var relValue = $scope.data[hero][i]['stats'][keys[j]]['relative'];
                var actValue = $scope.data[hero][i]['stats'][keys[j]]['actual'];

                $scope["myChartObject_" + playMode + "_" + hero].data.rows[j].c.push({ v: relValue });
                $scope["myChartObject_" + playMode + "_" + hero].data.rows[j].c.push({ v: $scope.createHTMLTooltip($scope.data[hero][i].name, actValue) });

                /*

                var relValues = [];
                relValues.push($scope.data[hero][i]['stats'][keys[j]]['relative']);

                var actValues = [];
                actValues.push($scope.data[hero][i]['stats'][keys[j]]['actual']);

                for (var k = 0; k < relValues.length; k++) {
                    $scope["myChartObject_" + playMode + "_" + hero].data.rows[j].c.push({ v: relValues[k] });
                    $scope["myChartObject_" + playMode + "_" + hero].data.rows[j].c.push({ v: $scope.createHTMLTooltip($scope.data[hero][i].name, actValues[k])});

                }
                */
            }
        }
    }

    $scope.createHTMLTooltip = function (name, value) {
        value = value.toFixed(2);
        if (value > 100)
            value = Math.floor(value);
        return '' + name + ': \n' + value.toString()//.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
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

    $scope.changeActivePlayMode = function (ind) {
        $scope.selectedMode = $scope.modes[ind];
        $scope.loadPlayMode();
    }

    $scope.init = function () {
        $scope.currentHero = $scope.heroOptions[0];
        $scope.clearHeroClasses();

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
            $scope.refreshSlider();
        }, function errorCallback(response) {
            // called asynchronously if an error occurs
            // or server returns response with an error status.
        });
    }

    $scope.initChartData = function() {
        return {
            "cols": [
                { id: "t", label: "Pharah", type: "string" }
            ], "rows": []
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
